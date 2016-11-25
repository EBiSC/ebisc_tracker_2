#!/usr/bin/env perl

use strict;
use warnings;
use EBiSC::Utils::hPSCreg qw();
use EBiSC::Utils::IMS qw();
use EBiSC::Utils::Biosamples qw();
use EBiSC::Utils::Question qw();
use EBiSC::Utils::ECACC qw();
use EBiSC::API::hPSCreg;
use EBiSC::API::IMS;
use EBiSC::API::Biosamples;
use EBiSC::API::ECACC;
use EBiSC::MongoDB;
use Time::Moment;

my $hpscreg_api = EBiSC::API::hPSCreg->new(
  user => $ENV{HPSCREG_USER} || die( 'HPSCREG_USER not set'),
  pass => $ENV{HPSCREG_PASS} || die( 'HPSCREG_PASS not set'),
);
my $ims_api = EBiSC::API::IMS->new(
  user => $ENV{IMS_USER} || die( 'IMS_USER not set'),
  pass => $ENV{IMS_PASS} || die( 'IMS_PASS not set'),
);
my $db = EBiSC::MongoDB->new(
  host => $ENV{MONGODB_HOST},
  pass => $ENV{MONGODB_PASS},
  user => $ENV{MONGODB_USER},
);

my @service_errors;
my %timings;

my ($now1, $now2);
$now1 = Time::Moment->now_utc;
eval {
  EBiSC::Utils::IMS::sync_db(
    api => $ims_api,
    db => $db,
  );
};
if ($@) {
  push(@service_errors, {service => 'IMS', error => $@});
}
$now2 = Time::Moment->now_utc;
$timings{ims_fetch} = $now1->delta_seconds($now2);
$now1 = $now2;

eval {
  EBiSC::Utils::hPSCreg::sync_db(
    api => $hpscreg_api,
    db => $db,
  );
};
if ($@) {
  push(@service_errors, {service => 'hPSCreg', error => $@});
}
$now2 = Time::Moment->now_utc;
$timings{hpscreg_fetch} = $now1->delta_seconds($now2);
$now1 = $now2;

eval {
  EBiSC::Utils::Biosamples::sync_db(
    api => EBiSC::API::Biosamples->new(),
    db => $db,
  );
};
if ($@) {
  push(@service_errors, {service => 'Biosamples', error => $@});
}
$now2 = Time::Moment->now_utc;
$timings{biosamples_fetch} = $now1->delta_seconds($now2);
$now1 = $now2;

eval {
  EBiSC::Utils::ECACC::sync_db(
    api => EBiSC::API::ECACC->new(),
    db => $db,
  );
};
if ($@) {
  push(@service_errors, {service => 'ECACC', error => $@});
}
$now2 = Time::Moment->now_utc;
$timings{ecacc_fetch} = $now1->delta_seconds($now2);
$now1 = $now2;

eval {
  $db->exam->ensure_indexes;
  $db->question_fail->ensure_indexes;
  $db->question_module->ensure_indexes;
};
if ($@) {
  push(@service_errors, {service => 'ECACC', error => $@});
}

my $exam = EBiSC::Utils::Question::run_questions(
  db => $db
);
$now2 = Time::Moment->now_utc;
$timings{ask_questions} = $now1->delta_seconds($now2);
$now1 = $now2;

$exam->{serviceErrors} = \@service_errors;
$exam->{timings} = \%timings;

EBiSC::Utils::Question::commit_exam (
  db => $db,
  exam => $exam,
);
