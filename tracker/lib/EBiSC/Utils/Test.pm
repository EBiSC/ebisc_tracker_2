package EBiSC::Utils::Test;
use Time::Moment;
use strict;
use warnings;
use boolean qw(true false);

our @modules = qw(
  IMSBiosample LiveNoBatches LiveNoClip LiveNoCofA hPSCregBiosample
  hPSCregIMSAgree::BiosampleIDs hPSCregIMSAgree::DonorBiosampleIDs
  hPSCregIMSAgree::IMSExported hPSCregIMSAgree::hPSCregExported
);

sub run_tests {
  my (%options) = @_;
  $options{now} //= Time::Moment->now_utc;
  my @failed_modules;
  my @results;
  MODULE:
  foreach my $module (@modules) {
    my $result = eval { run_module(%options, module => $module); };
    warn "$module $@" if $@;
    if ($result) {
      push(@results, {module => $module, %$result});
    }
    else {
      push(@failed_modules, $module);
    }
  }
  $options{db}->code_run->c->insert({
    date => $options{now},
    modules => \@results,
    failed_modules => \@failed_modules,
  });
}

sub run_module {
  my (%options) = @_;
  my $db = $options{db};

  my $full_module = 'EBiSC::Test::'.$options{module};
  eval "require $full_module";
  if ($@) {
    warn "skipping test $full_module: $@";
    return;
  }

  my $tester = $full_module->new(
    db => $db,
  );

  $db->test_module->c->update_one(
    [ module => $options{module}],
    { '$set' => {
      module => $options{module},
      title => $tester->title,
      description => $tester->description,
    }},
    { upsert => boolean::true},
  );

  $tester->run();

  foreach my $fail (@{$tester->failed_items}) {
    $fail->{module} = $options{module},
    $fail->{date} = $options{now},
    $db->test_fail->c->insert_one($fail);
  }

  return {
    num_tested => $tester->num_tested,
    num_failed => $tester->num_failed,
  };

}

1;
