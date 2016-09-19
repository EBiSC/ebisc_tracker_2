package EBiSC::API::hPSCreg;
use namespace::autoclean;
use Moose;
use JSON qw(decode_json encode_json);
use LWP::UserAgent;
use strict;
use warnings;

has 'host' => (is => 'rw', isa => 'Str', default => 'hpscreg.eu');
has 'ua' => (is => 'ro', isa => 'LWP::UserAgent', lazy => 1, default => sub {return LWP::UserAgent->new;});

has 'realm' => (is => 'rw', isa => 'Str', default => 'hPSCreg API');
has 'user' => (is => 'rw', isa => 'Str');
has 'pass' => (is => 'rw', isa => 'Str');
has 'port' => (is => 'rw', isa => 'Int', default => 443);

has 'base_url' => (is => 'ro', isa => 'Str', builder => '_build_base_url', lazy => 1);

has 'line_names' => (is => 'ro', isa => 'ArrayRef[Str]', builder => '_full_list', lazy => 1);
has 'lines' => (is => 'ro', isa => 'EBiSC::Cursor::hPSCreg', lazy => 1, builder => '_build_cursor');

sub BUILD {
  my ($self) = @_;
  $self->ua->credentials(sprintf("%s:%u", $self->host, $self->port), $self->realm, $self->user, $self->pass);
  $self->ua->timeout(5);
}

sub _build_base_url {
  my ($self) = @_;
  return sprintf('https://%s', $self->host);
}

sub _full_list {
  my ($self, %options) = @_;
  my $url = sprintf('%s%s', $self->base_url, $options{url}||"/api/full_list");
  my $response = $self->ua->get($url);
  die $response->status_line if $response->is_error;
  my $content = eval{decode_json($response->content);};
  if ($@) {
    die "problem with content from $url\n".$response->content;
  }
  return $content;
}

sub _build_cursor {
  my ($self) = @_;
  require EBiSC::Cursor::hPSCreg;
  return EBiSC::Cursor::hPSCreg->new(api => $self);
}

sub get_line {
  my ($self, $line_name) = @_;
  my $url = sprintf('%s/api/export/%s', $self->base_url, $line_name);
  my $response = $self->ua->get($url);
  die $response->status_line if $response->is_error;
  my $content = eval{decode_json($response->content);};
  if ($@) {
    die "problem with content from $url\n".$response->content;
  }
  return $content;
}


1;
