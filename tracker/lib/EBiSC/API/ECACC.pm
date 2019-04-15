package EBiSC::API::ECACC;
use namespace::autoclean;
use Moose;
use LWP::UserAgent;
use boolean qw(true false);
use strict;
use warnings;

has 'base_url' => (is => 'rw', isa => 'Str', default => 'http://www.phe-culturecollections.org.uk/products/celllines/ipsc/detail.jsp?refId=%s&collection=ecacc_ipsc');
has 'ua' => (is => 'ro', isa => 'LWP::UserAgent', lazy => 1, default => sub {return LWP::UserAgent->new;});

sub BUILD {
  my ($self) = @_;
  $self->ua->env_proxy;
}

sub get_sample {
  my ($self, $id) = @_;
  my $url = sprintf($self->base_url, $id);
  my $response = $self->ua->get($url);
  die $response->status_line if $response->is_error;
  return ($response->content =~ m{[\s>]$id[\s<]}) ? true : false;
}

1;
