package EBiSC::Utils::Biosamples;
use strict;
use warnings;

sub sync_db {
  my (%options) = @_;
  my $api = $options{api};
  my $db = $options{db};
  $options{now} //= Time::Moment->now_utc;
  $db->biosample->reset;
  $db->biosample_group->reset;

  my %processed_ids;
  my $cursor1 = $db->hpscreg_line->c->find({}, {projection => {'obj.biosamples_id' => 1, 'obj.biosamples_donor_id' => 1}});
  while (my $next = $cursor1->next) {
    ID:
    foreach my $id (@{$next->{obj}}{qw(biosamples_id biosamples_donor_id)}) {
      next ID if !$id || $processed_ids{$id};
      my $obj = $api->get_sample($id);
      next ID if !$obj;
      my $res = $db->biosample->c->insert_one({
      biosample_id => $id,
      date => $options{now},
      obj => $obj,
      });
      die "Database insert error" if !$res->acknowledged;
      $res->assert;
      $processed_ids{$id} = 1;
    }
  }

  my %derived_from_cache = ();
  my $cursor2 = $db->ims_line->c->find({}, {projection => {'obj.biosamples_id' => 1, 'obj.donor.biosamples_id' => 1, 'obj.batches.biosamples_id' => 1}});
  while (my $next = $cursor2->next) {
    ID:
    foreach my $id ($next->{obj}{biosamples_id}, $next->{obj}{donor}{biosamples_id}) {
      next ID if !$id || $processed_ids{$id};
      my $obj = $api->get_sample($id);
      next ID if !$obj;
      my $res = $db->biosample->c->insert_one({
      biosample_id => $id,
      date => $options{now},
      obj => $obj,
      });
      die "Database insert error" if !$res->acknowledged;
      $res->assert;
      $processed_ids{$id} = 1;
    }
    ID:
    foreach my $id (map {$_->{biosamples_id}} @{$next->{obj}{batches}}) {
      next ID if $processed_ids{$id};
      my $obj = $api->get_group($id);
      next ID if !$obj;

      my $vial_derived_from = [];
      if (my $vial_id = $obj->{samples} && $obj->{samples}[0]) {
        $vial_derived_from = $api->get_derived_from($vial_id, \%derived_from_cache);
      }

      my $res = $db->biosample_group->c->insert_one({
      biosample_id => $id,
      date => $options{now},
      vialDerivedFrom => $vial_derived_from,
      obj => $obj,
      });
      die "Database insert error" if !$res->acknowledged;
      $res->assert;
      $processed_ids{$id} = 1;

      
    }
  }

}

1;
