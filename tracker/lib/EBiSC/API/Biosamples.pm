package EBiSC::API::Biosamples;
use namespace::autoclean;
use Moose;
use JSON qw(decode_json encode_json);
use LWP::UserAgent;
use strict;
use warnings;

has 'base_url' => (is => 'rw', isa => 'Str', default => 'https://www.ebi.ac.uk/biosamples/api');
has 'base_url_v4' => (is => 'rw', isa => 'Str', default => 'https://www.ebi.ac.uk/biosamples');
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

sub get_sample_v4 {
  my ($self, $id) = @_;
  my $url = sprintf('%s/samples/%s', $self->base_url_v4, $id);
  my @headers = (
	  'Accept' => 'application/json',
  );
  my $response = $self->ua->get($url, @headers);
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
  my ($self, $id, $derived_from_cache) = @_;

  if (exists $derived_from_cache->{$id}) {
	  return $derived_from_cache->{$id};
  }

  my $sample = $self->get_sample_v4($id);
  my @derived_from = ();

  RELATION:
  foreach my $relation (@{$sample->{relationships}}) {
    next RELATION if $relation->{type} ne "derived from";
    next RELATION if $relation->{source} ne $sample->{accession};
    my $target = $relation->{target};
	push(@derived_from, $target);
	my $derived_from_target = $self->get_derived_from($target, $derived_from_cache);
	foreach my $df (@{$derived_from_target}) {
		push(@derived_from, $df);
	}
  }
  $derived_from_cache->{$id} = \@derived_from;
  return \@derived_from;
}


1;
