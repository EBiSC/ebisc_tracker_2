#!/usr/bin/env perl

use strict;
use warnings;

use Data::Dumper;

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

#my $hpscreg_api = EBiSC::API::hPSCreg->new(
#  user => $ENV{HPSCREG_USER} || die( 'HPSCREG_USER not set'),
#  pass => $ENV{HPSCREG_PASS} || die( 'HPSCREG_PASS not set'),
#);
#my $ims_api = EBiSC::API::IMS->new(
#  user => $ENV{IMS_USER} || die( 'IMS_USER not set'),
#  pass => $ENV{IMS_PASS} || die( 'IMS_PASS not set'),
#);
#my $db = EBiSC::MongoDB->new(
#  host => $ENV{MONGODB_HOST},
#  pass => $ENV{MONGODB_PASS},
#  user => $ENV{MONGODB_USER},
#);

my $biosamples_api = EBiSC::API::Biosamples->new();

#my $batch = $biosamples_api->get_group("SAMEG314740");
#print Data::Dumper->Dump([$batch], [qw(batch)]);

my $vial = $biosamples_api->get_sample_v4("SAMEA4342692");
print Data::Dumper->Dump([$vial], [qw(vial)]);

my $derived_from = $biosamples_api->get_derived_from("SAMEA4342692");
print Data::Dumper->Dump([$derived_from], [qw(derived_from)]);
