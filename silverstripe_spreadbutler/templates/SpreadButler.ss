<% require javascript(sapphire/thirdparty/jquery/jquery.js) %>

<script type="text/javascript" src="{$BaseHref}sb.fcgi/js/jquery.SpreadButler.js"></script>
<script type="text/javascript">
jQuery(document).ready(function() {
   $(document).ready(function(){
     $('#$tableId').spreadButlerFillTable({
       server : '{$BaseHref}sb.fcgi/',
       file   : '$fileName'
       $stopColumns
       $startRow
       $minColumn
       $maxColumn
       $recalcClick
     });
   });
});
</script>
