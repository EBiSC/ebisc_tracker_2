package EBiSC::Cursor::hPSCreg;
use namespace::autoclean;
use Moose;
use strict;
use warnings;

has 'api' => (is => 'ro', isa => 'EBiSC::API::hPSCreg');
has 'i' => (is => 'rw', isa => 'Int', default => 0);

sub next {
  my ($self) = @_;
  my $i = $self->i;
  return undef if $i < 0;
  my $line_names = $self->api->line_names;
  return undef if $i >= @$line_names;
  $self->i($i+1);
  return {
    name => $line_names->[$i],
    obj => $self->api->get_line($line_names->[$i]),
  };
}

1;
