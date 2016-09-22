package EBiSC::Utils::Biosamples;
use strict;
use warnings;

sub sync_db {
  my (%options) = @_;
  my $api = $options{api};
  my $db = $options{db};
  $options{now} //= Time::Moment->now_utc;
  $db->biosample->reset;

  my %processed_ids;
  my $cursor1 = $db->hpscreg_line->c->find({}, {projection => {'obj.biosamples_id' => 1, 'obj.biosamples_donor_id' => 1}});
  while (my $next = $cursor1->next) {
    ID:
    foreach my $id (@{$next->{obj}}{qw(biosamples_id biosamples_donor_id)}) {
      next ID if !$id || $processed_ids{$id};
      my $obj = $api->get_sample($id);
      my $res = $db->biosample->c->insert_one({
      biosample_id => $id,
      date => $options{now},
      obj => $obj,
      });
      $processed_ids{$id} = 1;
    }
  }

  my $cursor2 = $db->ims_line->c->find({}, {projection => {'obj.biosamples_id' => 1, 'obj.donor.biosamples_id' => 1}});
  while (my $next = $cursor2->next) {
    ID:
    foreach my $id ($next->{obj}{biosamples_id}, $next->{obj}{donor}{biosamples_id}) {
      next ID if !$id || $processed_ids{$id};
      my $obj = $api->get_sample($id);
      my $res = $db->biosample->c->insert_one({
      biosample_id => $id,
      date => $options{now},
      obj => $obj,
      });
      $processed_ids{$id} = 1;
    }
  }
}

1;
