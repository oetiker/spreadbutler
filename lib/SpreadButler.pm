package SpreadButler;
use Mojo::Base 'Mojolicious';
use Spreadsheet::Read;

# This method will run once at server start
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
        my $sheet = int($self->param('sheet')) || 1;

        $self->app->log->debug("file: $file, sheet: $sheet");
        my $ref = ReadData($ENV{SPREAD_BUTLER_ROOT}.'/'.$file,cells => 1,rc=>0,attr=>0);
        $self->render(json => $ref->[$sheet]);       
    });
}

1;
