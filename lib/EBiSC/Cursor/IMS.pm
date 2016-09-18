package EBiSC::Cursor::IMS;
use namespace::autoclean;
use Moose;
use strict;
use warnings;

has 'api' => (is => 'ro', isa => 'EBiSC::API::IMS');
has 'token' => (is => 'rw', isa => 'Maybe[Str]');
has '_lines' => (is => 'rw', isa=> 'ArrayRef',);

sub next {
  my ($self) = @_;
  if (my $lines = $self->_lines) {
    my $next = shift @$lines;
    return $next if $next;
  }
  return undef if !$self->token;
  my $res = $self->api->get_lines($self->token);
  $self->token($res->{meta}{next});
  my $next = shift @{$res->{objects}};
  $self->_lines($res->{objects});
  return $next;
}

1;
