package SpreadButler;
use Mojo::Base 'Mojolicious';
use Spreadsheet::Read;
use Encode;

our $toUTF8 = find_encoding('utf8');


# This method will run once at server start
our %cache;

sub col2num ($) {
    my $alpha = uc shift;
    return unless $alpha;
    my $num = 0;
    for ($alpha =~ /./g){  
        $num = ord($_) - 64 + $num * 26;
    }
    return $num;
}

sub clean_null ($) {
    return undef if ($_[0] and $_[0] eq 'null') or ($_[0] eq '');
    return $_[0];
}

sub startup {
    my $self = shift;
    $self->secrets(['no secret since we use no cookies']);
    # Routes
    my $r = $self->routes;
    # Normal route to controller
    $r->any('/fetch' => sub {
        my $self = shift;
        my $file = $self->param('file');
        if ($file =~ m|/|){
            $self->render(text => 'You can only specify simple file names!', status => 500);
            return;
        }        
        my $sheet = int(clean_null $self->param('sheet')) || 1;
        $self->app->log->debug("file: $file, sheet: $sheet");
        my $path = $ENV{SPREAD_BUTLER_DATA}.'/'.$file;
        my $age = -M $path;
        if (not $cache{$path} or $cache{$path}{AGE} > $age){
            $cache{$path} = {
                AGE => $age,
                DATA => ReadData($ENV{SPREAD_BUTLER_DATA}.'/'.$file,cells=>0,rc=>1,attr=>0,strip=>3)
            };
        }
        my $ref = $cache{$path}{DATA};    
        my $data = {};
        my $minRow =  clean_null $self->param('minRow');                
        my $maxRow =  clean_null $self->param('maxRow');
        my $minColumn = col2num clean_null $self->param('minColumn');
        my $maxColumn = col2num clean_null $self->param('maxColumn');
        my $cellArray = $ref->[$sheet]{cell};
        #die Dumper $cellArray;
        my $colId = 'A';
        for (my $colNum = 1;$colNum < @$cellArray;$colNum++){
            my $colData = $cellArray->[$colNum];
            for ( my $rowId = 1; $rowId < @$colData; $rowId++ ){
                my $el = $colData->[$rowId];
                if ( defined $el 
                     and ( not defined $minRow or $rowId >= $minRow )
                     and ( not defined $maxRow or $rowId <= $maxRow )
                     and ( not defined $minColumn or $colNum >= $minColumn)
                     and ( not defined $maxColumn or $colNum <= $maxColumn) ){
                    $data->{"$colId$rowId"} = $el; # $toUTF8->decode($el);
                }
            }
            $colId++;
        };
        $self->render(json => $data);
    });
}

1;
