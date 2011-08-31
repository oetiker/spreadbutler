package SpreadButtler;
use Mojo::Base 'Mojolicious';
use Spreadsheet::Read;

# This method will run once at server start
sub startup {
    my $self = shift;
    # Routes
    my $r = $self->routes;
    # Normal route to controller
    $r->any('/fetch' => sub {
        my $ref = ReadData($ENV{SPREAD_BUTTLER_FILE},{cells => 0});
        $self->render(json => $ref[1]);       
    });
}

1;
