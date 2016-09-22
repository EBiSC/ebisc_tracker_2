package EBiSC::API::Biosamples;
use namespace::autoclean;
use Moose;
use JSON qw(decode_json encode_json);
use LWP::UserAgent;
use strict;
use warnings;

has 'base_url' => (is => 'rw', isa => 'Str', default => 'https://www.ebi.ac.uk/biosamplesbeta/api');
has 'ua' => (is => 'ro', isa => 'LWP::UserAgent', lazy => 1, default => sub {return LWP::UserAgent->new;});

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

1;
