package EBiSC::Utils::ECACC;
use strict;
use warnings;
use boolean qw(true false);

sub sync_db {
  my (%options) = @_;
  my $api = $options{api};
  my $db = $options{db};
  $options{now} //= Time::Moment->now_utc;
  $db->ecacc_line->reset;

  my $cursor = $db->ims_line->c->find(
    {
      name => {'$exists' => boolean::true },
      'obj.ecacc_cat_no' => {'$exists' => boolean::true }
    },
    {projection => {'name' => 1, 'obj.ecacc_cat_no' => 1}}
  );
  while (my $next = $cursor->next) {
    my $res = $db->ecacc_line->c->insert_one({
      name => $next->{name},
      exported => $api->get_sample($next->{obj}{ecacc_cat_no}),
    });
    die "Database insert error" if !$res->acknowledged;
    $res->assert;
  }
}

1;
