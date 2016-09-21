package EBiSC::MongoDB;
use Moose;
use namespace::autoclean;
use MongoDB;
use strict;
use warnings;


my @collection_classes = qw( hPSCregLine IMSLine Biosample QuestionFail CodeRun QuestionModule );

has 'client' => (is => 'rw', isa => 'MongoDB::MongoClient', builder => '_build_client', lazy => 1);
has 'db' => (is => 'rw', isa => 'MongoDB::Database', builder => '_build_db', lazy => 1);
has 'db_name' => (is => 'rw', isa => 'Str', default => 'ebisc');
has 'host' => (is => 'ro', isa => 'Maybe[Str]');
has 'pass' => (is => 'ro', isa => 'Maybe[Str]');
has 'user' => (is => 'ro', isa => 'Maybe[Str]');

foreach my $class_suffix (@collection_classes) {
  my $class = 'EBiSC::MongoDB::'.$class_suffix;
  eval "require $class";
  has $class->new->name => (is => 'rw', isa => $class, lazy => 1, default => sub {
    my ($self) = @_;
    return $class->new(db => $self->db);
  });
}

sub _build_client {
  my ($self) = @_;
  return MongoDB->connect($self->host, {
     bson_codec => {dt_type => undef},
     password => $self->pass,
     username => $self->user,
     db_name => $self->db_name,
  });
};

sub _build_db {
  my ($self) = @_;
  return $self->client->db($self->db_name);
}

1;
