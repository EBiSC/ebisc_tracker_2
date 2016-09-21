#!/usr/bin/env perl

use strict;
use warnings;
use EBiSC::Utils::hPSCreg qw();
use EBiSC::Utils::IMS qw();
use EBiSC::Utils::Question qw();
use EBiSC::API::hPSCreg;
use EBiSC::API::IMS;
use EBiSC::MongoDB;

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

EBiSC::Utils::IMS::sync_db(
  api => $ims_api,
  db => $db,
);

EBiSC::Utils::hPSCreg::sync_db(
  api => $hpscreg_api,
  db => $db,
);

$db->code_run->ensure_indexes;
$db->question_fail->ensure_indexes;
$db->question_module->ensure_indexes;

EBiSC::Utils::Question::run_questions(
  db => $db
);
