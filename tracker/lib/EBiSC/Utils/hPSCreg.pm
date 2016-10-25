package EBiSC::Utils::hPSCreg;
use Time::Moment;
use strict;
use warnings;

sub sync_db {
  my (%options) = @_;
  my $api = $options{api};
  my $db = $options{db};
  $options{now} //= Time::Moment->now_utc;
  $db->hpscreg_line->reset;
  my $cursor = $api->lines;
  while (my $next = $cursor->next) {
    my $res = $db->hpscreg_line->c->insert_one({
    name => $next->{name},
    date => $options{now},
    obj => $next->{obj},
    });
    die "Database insert error" if !$res->acknowledged;
    $res->assert;
  }
}

1;
