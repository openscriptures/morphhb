<?xml version="1.0" encoding="UTF-8"?>

<!--
    Document   : OsisChapter.xsl
    Created on : February 20, 2013, 4:18 PM
    Author     : troidl
    Description:
        Transforms OSIS chapter to HTML div.
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:osis="http://www.bibletechnologies.net/2003/OSIS/namespace"
				xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output method="xml" omit-xml-declaration="yes" indent="yes"/>

    <xsl:template match="/">
        <div>
            <xsl:apply-templates/>
        </div>
    </xsl:template>
	
    <xsl:template match="osis:chapter">
        <xsl:element name="div">
            <xsl:attribute name="id">
                <xsl:value-of select="./@osisID" />
            </xsl:attribute>
            <xsl:element name="span">
                <xsl:attribute name="class">
                    <xsl:text>chapter</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="@osisID"/>
            </xsl:element>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="osis:verse">
        <xsl:variable name="bcv" select="substring-after(substring-after(@osisID, '.'), '.')"/>
        <xsl:element name="span">
            <xsl:attribute name="id">
                <xsl:value-of select="./@osisID" />
            </xsl:attribute>
            <xsl:element name="sup">
                <xsl:attribute name="class">
                    <xsl:text>osisID</xsl:text>
                </xsl:attribute>
                <xsl:value-of select="$bcv"/>
            </xsl:element>
            <xsl:text>&#160;</xsl:text>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="osis:w">
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>Hebrew</xsl:text>
            </xsl:attribute>
            <xsl:attribute name="title">
                <xsl:value-of select="./@lemma" />
                <xsl:if test="@morph">
                    <xsl:text>&#10;</xsl:text>
                    <xsl:value-of select="./@morph" />
                </xsl:if>
            </xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="osis:seg">
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>punctuation</xsl:text>
            </xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="osis:note">
        <xsl:text> </xsl:text>
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>note</xsl:text>
            </xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="osis:catchWord"></xsl:template>

    <xsl:template match="osis:rdg">
        <xsl:element name="span">
            <xsl:attribute name="class">
                <xsl:text>qere</xsl:text>
            </xsl:attribute>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>

</xsl:stylesheet>