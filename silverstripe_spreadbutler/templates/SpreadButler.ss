<% require javascript(sapphire/thirdparty/jquery/jquery.js) %>
<% require javascript(http://d3js.org/d3.v2.js) %>
<script type="text/javascript" src="{$BaseHref}sb.fcgi/js/jquery.SpreadButler.js"></script>
<script type="text/javascript">
jQuery(document).ready(function() {
   jQuery('#$tableId').spreadButlerFillTable({
       server : '{$BaseHref}sb.fcgi/',
       file   : '$fileName'
       $stopColumns
       $startRow
       $minColumn
       $maxColumn
       $recalcClick
       $sortCol
       $finalizeCallback
       $dataLoadCallback
   });
});
</script>
