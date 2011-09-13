<?php
/* this is NOT a page type, it just serves to  hold the spreadbutler short code */
class SpreadButler {
    public static function SpreadButlerShortCodeHandler($arguments) {
        $template = new SSViewer('SpreadButler');
        $config = array();
        $config['tableId'] = $arguments['table_id'];
        $config['fileName'] = $arguments['file_name'];
        $config['stopColumns'] = $arguments['stop_columns'] ? ',stopColumns: [' . $arguments['stop_columns'] . ']' : '';
        $config['startRow'] = $arguments['start_row'] ? ',startRow: "' . $arguments['start_row'] . '"' : '';
        $config['minColumn'] = $arguments['min_column'] ? ',minColumn: "' . $arguments['min_column'] . '"' : '';
        $config['maxColumn'] = $arguments['max_column'] ? ',maxColumn: "' . $arguments['max_column'] . '"' : '';
        $config['recalcClick'] = $arguments['recalc_click'] ? ',recalcClick: $("#'. $arguments['recalc_click'] . '")' : '';
        $config['sortCol'] =  $arguments['sort_col'] ? ',sortCol: ' . (0+$arguments['sort_col']) : '';
        return $template->process(new ArrayData($config));
    }                                                                                                                                         
}

?>
