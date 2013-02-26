<?php
/**
 * XSLTransform performs XSL transformations.
 *
 * @author troidl
 */
class XSLTransform
{
    private $proc;
    /**
     * The constructor initializes the XSLT document.
     * @param string $xslPath The path to the XSLT style sheet.
     */
    public function __construct($xslPath)
    {
        $xsl = new DOMDocument;
        $xsl->load($xslPath);
        $this->proc = new XSLTProcessor();
        $this->proc->importStyleSheet($xsl);
    }
    /**
     * Transforms the XML with the given parameters.
     * @param string $xml
     * @param array $params
     * @return string 
     */
    public function Transform($xml, $params = FALSE)
    {
        $doc = new DOMDocument;
        $doc->loadXML($xml);
        if ($params) {
            $this->proc->setParameter('', $params);
        }
        return $this->proc->transformToXML($doc);
    }
}

?>