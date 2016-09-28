package EBiSC::API::IMS;
use namespace::autoclean;
use Moose;
use JSON qw(decode_json encode_json);
use LWP::UserAgent;
use strict;
use warnings;

has 'ua' => (is => 'ro', isa => 'LWP::UserAgent', lazy => 1, default => sub {return LWP::UserAgent->new;});
has 'user' => (is => 'rw', isa => 'Str');
has 'pass' => (is => 'rw', isa => 'Str');
has 'base_url' => (is => 'rw', isa => 'Str', default => 'cells.ebisc.org');

has 'lines' => (is => 'ro', isa => 'EBiSC::Cursor::IMS', lazy => 1, builder => '_build_cursor');

sub BUILD {
  my ($self) = @_;
  $self->ua->default_header(Authorization => sprintf('ApiKey %s:%s', $self->user, $self->pass));
  $self->ua->timeout(30);
}


sub _build_cursor {
  my ($self) = @_;
  require EBiSC::Cursor::IMS;
  return EBiSC::Cursor::IMS->new(api => $self, token => 'api/v0/cell-lines/?format=json');
}


sub get_lines {
  my ($self, $token) = @_;
  my $response = $self->ua->get(sprintf('https://%s/%s', $self->base_url, $token));
  die $response->status_line if $response->is_error;
  return decode_json($response->content);
}


1;
