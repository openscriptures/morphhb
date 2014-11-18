<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:apt="http://www.APTBibleTools.com/namespace">
	<xsl:output method="xml" omit-xml-declaration="yes"/>
	
	<xsl:template match="/">
		<xsl:apply-templates select="//apt:w"/>
	</xsl:template>
	
	<xsl:template match="apt:w">
		<xsl:text>"</xsl:text><xsl:value-of select="@v"/><xsl:text>","</xsl:text><xsl:value-of select="@a"/><xsl:text>"
</xsl:text>
	</xsl:template>
	
</xsl:stylesheet>