package EBiSC::Utils::Question;
use Time::Moment;
use Text::Markdown qw(markdown);
use strict;
use warnings;
use boolean qw(true false);

our @modules = qw(
  IMSBiosample LiveNoBatches LiveNoClip LiveNoCofA hPSCregBiosample
  hPSCregIMSAgree::BiosampleIDs hPSCregIMSAgree::DonorBiosampleIDs
  hPSCregIMSAgree::IMSExported hPSCregIMSAgree::hPSCregExported
  ECACCLive
  Biosamples::LineExported Biosamples::DonorExported
  Biosamples::BatchExported Biosamples::OriginCellLine
  Biosamples::OriginDonor Biosamples::VialDerivedFrom
);

sub run_questions {
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
  return {
    date => $options{now},
    questions => \@results,
    failedModules => \@failed_modules,
  };
}

sub commit_exam {
  my (%options) = @_;
  $options{db}->exam->c->insert($options{exam});
}

sub run_module {
  my (%options) = @_;
  my $db = $options{db};

  my $full_module = 'EBiSC::Question::'.$options{module};
  eval "require $full_module";
  if ($@) {
    warn "skipping question $full_module: $@";
    return;
  }

  my $questioner = $full_module->new(
    db => $db,
  );

  $db->question_module->c->update_one(
    [ module => $options{module}],
    { '$set' => {
      module => $options{module},
      title => $questioner->title,
      description => markdown($questioner->description),
    }},
    { upsert => boolean::true},
  );

  $questioner->run();

  foreach my $fail (@{$questioner->failed_items}) {
    $fail->{module} = $options{module},
    $fail->{date} = $options{now},
    my $res = $db->question_fail->c->insert_one($fail);
    die "Database insert error" if !$res->acknowledged;
    $res->assert;
  }

  return {
    numTested => $questioner->num_tested,
    numFailed => $questioner->num_failed,
  };

}

1;
