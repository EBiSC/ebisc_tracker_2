package EBiSC::API::Biosamples;
use namespace::autoclean;
use Moose;
use JSON qw(decode_json encode_json);
use LWP::UserAgent;
use strict;
use warnings;

has 'base_url' => (is => 'rw', isa => 'Str', default => 'https://www.ebi.ac.uk/biosamples/api');
has 'ua' => (is => 'ro', isa => 'LWP::UserAgent', lazy => 1, default => sub {return LWP::UserAgent->new;});

sub BUILD {
  my ($self) = @_;
  $self->ua->env_proxy;
}

sub get_sample {
  my ($self, $id) = @_;
  my $url = sprintf('%s/samples/%s', $self->base_url, $id);
  my $response = $self->ua->get($url);
  return undef if $response->is_client_error; # implies not found
  die $response->status_line if $response->is_error;
  my $content = eval{decode_json($response->content);};
  if ($@) {
    die "problem with content from $url\n".$response->content;
  }
  return $content;
}

sub get_group {
  my ($self, $id) = @_;
  my $url = sprintf('%s/groups/%s', $self->base_url, $id);
  my $response = $self->ua->get($url);
  return undef if $response->is_client_error; # implies not found
  die $response->status_line if $response->is_error;
  my $content = eval{decode_json($response->content);};
  if ($@) {
    die "problem with content from $url\n".$response->content;
  }
  return $content;
}

sub get_derived_from {
  my ($self, $id) = @_;
  my %df_hash;
  $self->_get_derived_from($id, \%df_hash);
  return [keys %df_hash];
};

sub _get_derived_from {
  my ($self, $id, $df_hash) = @_;

  my $sample = $self->get_sample($id);
  my $sr_url = $sample->{_links}{relations}{href};
  return if !$sr_url;

  my $sr_response = $self->ua->get($sr_url);
  return if $sr_response->is_client_error; # implies not found
  die $sr_response->status_line if $sr_response->is_error;
  my $sr_content = eval{decode_json($sr_response->content);};
  if ($@) {
    die "problem with content from $sr_url\n".$sr_response->content;
  }

  my $df_url = $sr_content->{_links}{derivedFrom}{href};
  return if !$df_url;

  my $df_response = $self->ua->get($df_url);
  return if $df_response->is_client_error; # implies not found
  die $df_response->status_line if $df_response->is_error;
  my $df_content = eval{decode_json($df_response->content);};
  if ($@) {
    die "problem with content from $df_url\n".$df_response->content;
  }

  RELATION:
  foreach my $relation (@{$df_content->{_embedded}{samplesrelations}}) {
    my $accession = $relation->{accession};
    next RELATION if $df_hash->{$accession};
    $df_hash->{$accession} = 1;
    $self->_get_derived_from($accession, $df_hash);
  }
}


1;
