
use strict;
use warnings;
use utf8;
use open ':encoding(utf8)';
use Algorithm::Diff;
use Unicode::Normalize qw(decompose NFC);
use Data::Dumper qw(Dumper);
use JSON;
use XML::LibXML;
use XML::LibXML::XPathContext;
use Clone qw(clone);
use Hash::Merge qw(merge);

open OUT, ">index.js";
print OUT <<HEAD;
HEAD

#options
my $stripPointing = 'true';
my $removeLemmaTypes = 'true';
my $prefixLemmasWithH = 'true';
my $remapVerses = 'true';

my %bookNameData = ();
$bookNameData{'Gen'} = 'Genesis';
$bookNameData{'Exod'} = 'Exodus';
$bookNameData{'Lev'} = 'Leviticus';
$bookNameData{'Num'} = 'Numbers';
$bookNameData{'Deut'} = 'Deuteronomy';
$bookNameData{'Josh'} = 'Joshua';
$bookNameData{'Judg'} = 'Judges';
$bookNameData{'Ruth'} = 'Ruth';
$bookNameData{'1Sam'} = 'I Samuel';
$bookNameData{'2Sam'} = 'II Samuel';
$bookNameData{'1Kgs'} = 'I Kings';
$bookNameData{'2Kgs'} = 'II Kings';
$bookNameData{'1Chr'} = 'I Chronicles';
$bookNameData{'2Chr'} = 'II Chronicles';
$bookNameData{'Ezra'} = 'Ezra';
$bookNameData{'Neh'} = 'Nehemiah';
$bookNameData{'Esth'} = 'Esther';
$bookNameData{'Job'} = 'Job';
$bookNameData{'Ps'} = 'Psalms';
$bookNameData{'Prov'} = 'Proverbs';
$bookNameData{'Eccl'} = 'Ecclesiastes';
$bookNameData{'Song'} = 'Song of Solomon';
$bookNameData{'Isa'} = 'Isaiah';
$bookNameData{'Jer'} = 'Jeremiah';
$bookNameData{'Lam'} = 'Lamentations';
$bookNameData{'Ezek'} = 'Ezekiel';
$bookNameData{'Dan'} = 'Daniel';
$bookNameData{'Hos'} = 'Hosea';
$bookNameData{'Joel'} = 'Joel';
$bookNameData{'Amos'} = 'Amos';
$bookNameData{'Obad'} = 'Obadiah';
$bookNameData{'Jonah'} = 'Jonah';
$bookNameData{'Mic'} = 'Micah';
$bookNameData{'Nah'} = 'Nahum';
$bookNameData{'Hab'} = 'Habakkuk';
$bookNameData{'Zeph'} = 'Zephaniah';
$bookNameData{'Hag'} = 'Haggai';
$bookNameData{'Zech'} = 'Zechariah';
$bookNameData{'Mal'} = 'Malachi';

sub getBookData {
	my ( $filename ) = @_;
	my $dom = XML::LibXML->load_xml(location => $filename);
	my $xpc = XML::LibXML::XPathContext->new($dom);
	$xpc->registerNs('osis', 'http://www.bibletechnologies.net/2003/OSIS/namespace');

	my @bookData = ();
	my @chapters = $xpc->findnodes('//osis:chapter');

	foreach my $chapter (@chapters){
		my @verses = $xpc->findnodes('.//osis:verse', $chapter );
		my @verseArray = ();
		foreach my $verse (@verses){
			my @words = $xpc->findnodes('./osis:w', $verse );
			my @wordArray = ();
			foreach my $word (@words){
				my @singleWordArray = ();
				my $lemma = $word->getAttribute('lemma');
				if ( $removeLemmaTypes ) {
					$lemma = removeLemmaTypes($lemma);
				}
				if ( $prefixLemmasWithH ) {
					$lemma = prefixLemmasWithH($lemma);
				}
				my $morph = $word->getAttribute('morph');

				push @singleWordArray, $word->textContent;
				push @singleWordArray, $lemma;
				push @singleWordArray, $morph;
				push @wordArray, \@singleWordArray;
			}
			push @verseArray, \@wordArray;
		}
		push @bookData, \@verseArray;
	}

	return \@bookData;
}

sub prefixLemmasWithH {
	my ( $lemmaString ) = @_;
	my @lemmaArray = split /\//, $lemmaString;
	my @returnArray = ();
	foreach my $lemma (@lemmaArray) {
		push @returnArray, 'H' . $lemma;
	}
	my $returnString = join '/', @returnArray;
	return $returnString;
}

sub removeLemmaTypes {
	my ( $string ) = @_;
	$string =~ s/ a//g;
	$string =~ s/ b//g;
	$string =~ s/ c//g;
	$string =~ s/ d//g;
	$string =~ s/ e//g;
	$string =~ s/ f//g;
	$string =~ s/\+//g;
	return $string;
}

sub stripPointing {
	my ( $string ) = @_;
	$string =~ s/[\x{0590}-\x{05AF}\x{05BD}]//g;
	$string =~ s/[\x{05B0}-\x{05BB}]//g;
	$string =~ s/[\x{05BC}]//g;
	$string =~ s/[\x{05C1}]//g;
	$string =~ s/[\x{05C2}]//g;
	$string =~ s/[\x{05C4}]//g;
	$string =~ s/[\x{05C5}]//g;
	return $string;
}

my %hebrew = ();
while( my($bookNameShort, $bookName) = each %bookNameData) {
	$hebrew{ $bookName } = getBookData( 'wlc/'. $bookNameShort .'.xml' );
}

# map hebrew to english verses
my ( $filename ) = 'wlc/VerseMap.xml';
my $dom = XML::LibXML->load_xml(location => $filename);
my $xpc = XML::LibXML::XPathContext->new($dom);
$xpc->registerNs('vm', 'http://www.APTBibleTools.com/namespace');

my %remapped = %{ clone (\%hebrew) };

my @books = $xpc->findnodes('//vm:book');
foreach my $book (@books) {
	my @verses = $xpc->findnodes('.//vm:verse', $book );
	foreach my $verse (@verses) {
		if ($verse->getAttribute('type') eq 'full') {
			# take the wlc verse and move it to the kjv position
			my $wlcRef = $verse->getAttribute('wlc');
			my @wlcVerseArray = split(/\./, $wlcRef);
			my $kjvRef = $verse->getAttribute('kjv');
			my @kjvVerseArray = split(/\./, $kjvRef);

			my $kjvBook = $bookNameData{ $kjvVerseArray[ 0 ] };
			my $kjvChapter = $kjvVerseArray[ 1 ] - 1;
			my $kjvVerse = $kjvVerseArray[ 2 ] - 1;

			my $wlcBook = $bookNameData{ $wlcVerseArray[ 0 ] };
			my $wlcChapter = $wlcVerseArray[ 1 ] - 1;
			my $wlcVerse = $wlcVerseArray[ 2 ] - 1;
			my $wlcData = $hebrew{ $wlcBook }[ $wlcChapter ][ $wlcVerse ];

			#if ( $wlcChapter $kjvChapter $wlcVerse $kjvVerse

			if ( $kjvBook eq 'Psalms' && $kjvVerse eq 0 ) {
				$remapped{ $kjvBook }[ $kjvChapter ][ $kjvVerse ] = merge($hebrew{ $wlcBook }[ $wlcChapter ][ $wlcVerse - 1 ] , $wlcData);
				delete $remapped{ $wlcBook }[ $wlcChapter ][ $wlcVerse ];
			} else {
				$remapped{ $kjvBook }[ $kjvChapter ][ $kjvVerse ] = $wlcData;
				if ( $wlcChapter < $kjvChapter || ( $wlcChapter eq $kjvChapter && $wlcVerse > $kjvVerse ) || $wlcChapter > $kjvChapter ) {
					delete $remapped{ $wlcBook }[ $wlcChapter ][ $wlcVerse ];
				}
			}
		}
	}
}

# Fix partial verses manually
$remapped{ 'I Kings' }[ 17 ][ 32 ] = merge( $hebrew{ 'I Kings' }[ 17 ][ 32 ], $hebrew{ 'I Kings' }[ 17 ][ 33 ] );
splice( $remapped{ 'I Kings' }[ 17 ][ 32 ], 19, 25 );
splice( $remapped{ 'I Kings' }[ 17 ][ 33 ], 0, 10 );

$remapped{ 'I Kings' }[ 19 ][ 1 ] = merge( $hebrew{ 'I Kings' }[ 19 ][ 1 ], $hebrew{ 'I Kings' }[ 19 ][ 2 ] );
splice( $remapped{ 'I Kings' }[ 19 ][ 1 ], 13, 21 );
splice( $remapped{ 'I Kings' }[ 19 ][ 2 ], 0, 6 );

splice( $remapped{ 'I Kings' }[ 21 ][ 20 ], 8, 11 );
$remapped{ 'I Kings' }[ 21 ][ 21 ] = merge( $hebrew{ 'I Kings' }[ 21 ][ 20 ], $hebrew{ 'I Kings' }[ 21 ][ 21 ] );
splice( $remapped{ 'I Kings' }[ 21 ][ 21 ], 0, 8 );

$remapped{ 'I Kings' }[ 21 ][ 42 ] = merge($hebrew{ 'I Kings' }[ 21 ][ 42 ], $hebrew{ 'I Kings' }[ 21 ][ 43 ]);

$remapped{ 'Isaiah' }[ 63 ][ 0 ] = $hebrew{ 'Isaiah' }[ 62 ][ 18 ];
splice ( $remapped{ 'Isaiah' }[ 62 ][ 18 ], 8, 15 );
splice ( $remapped{ 'Isaiah' }[ 63 ][ 0 ], 0, 8 );

$remapped{ 'Psalms' }[ 12 ][ 4 ] = $hebrew{ 'Psalms' }[ 12 ][ 5 ];
splice( $remapped{ 'Psalms' }[ 12 ][ 4 ], 6, 10 );
splice( $remapped{ 'Psalms' }[ 12 ][ 5 ], 0, 6 );

#print Dumper \%hebrew;

my $json = NFC to_json(\%hebrew);
if ( $remapVerses ) {
	$json = NFC to_json(\%remapped);
}

if ( $stripPointing ) {
	$json = stripPointing($json);
}

$json =~ s/(?<=\},)/\n/g;
print OUT "var morphhb=$json;module.exports=morphhb;";
close OUT;
