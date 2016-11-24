package EBiSC::Utils::IMS;
use Time::Moment;
use strict;
use warnings;

sub sync_db {
  my (%options) = @_;
  my $api = $options{api};
  my $db = $options{db};
  $db->ims_line->reset;
  $db->ims_withdrawn->reset;
  $options{now} //= Time::Moment->now_utc;
  my $cursor = $api->lines;
  while (my $next = $cursor->next) {
    my $c = $next->{availability} && $next->{availability} eq 'Withdrawn' ? $db->ims_withdrawn->c : $db->ims_line->c;
    my $res = $c->insert_one({
      date => $options{now},
      obj => $next,
      name => $next->{name},
    });
    die "Database insert error" if !$res->acknowledged;
    $res->assert;
  }
}

1;
