package SpreadButler;
use Mojo::Base 'Mojolicious';
use Spreadsheet::Read;

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
    return undef if $_[0] and $_[0] eq 'null';
    return $_[0];
}

sub startup {
    my $self = shift;
    $self->secret('no secret since we use no cookies');
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
                DATA => ReadData($ENV{SPREAD_BUTLER_ROOT}.'/'.$file,cells => 1,rc=>0,attr=>0)
            };
        }        
        my $ref = $cache{$path}{DATA};    
        my $data = {};
        my $minRow =  clean_null $self->param('minRow');                
        my $maxRow =  clean_null $self->param('maxRow');
        my $minColumn = col2num clean_null $self->param('minColumn');
        my $maxColumn = col2num clean_null $self->param('maxColumn');
        for my $id (keys %{$ref->[$sheet]}){
            $id =~ /^([A-Z]+)(\d+)$/ or next;
            my $col = col2num $1;
            my $row = $2;
            next if $minRow and $row < $minRow;
            next if $maxRow and $row > $maxRow;
            next if $minColumn and $col < $minColumn;
            next if $maxColumn and $col > $maxColumn;
            $data->{$id} = $ref->[$sheet]{$id};
        };
        $self->render(json => $data);
    });
}

1;
