import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, X, Stethoscope } from "lucide-react";
import { useLocation } from "wouter";

const specializations = [
  "All",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Ophthalmology",
  "General Medicine",
];

export default function Doctors() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["/api/doctors"],
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === "All" ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleBookDoctor = (doctorId) => {
    setLocation(`/book-appointment?doctor=${doctorId}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" data-testid="text-page-title">
                Find Your Doctor
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Browse our network of qualified healthcare professionals and book
                your appointment today.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or specialization..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-doctors"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              <aside className="hidden lg:block">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Specializations
                    </h3>
                    <div className="mt-4 space-y-2">
                      {specializations.map((spec) => (
                        <Button
                          key={spec}
                          variant={selectedSpecialization === spec ? "secondary" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedSpecialization(spec)}
                          data-testid={`filter-${spec.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {spec}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>

              <div className="lg:col-span-3">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                    {selectedSpecialization !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedSpecialization}
                        <button
                          onClick={() => setSelectedSpecialization("All")}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                    {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {showFilters && (
                  <Card className="mb-6 lg:hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((spec) => (
                          <Badge
                            key={spec}
                            variant={selectedSpecialization === spec ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedSpecialization(spec);
                              setShowFilters(false);
                            }}
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex-1 space-y-3">
                              <Skeleton className="h-6 w-48" />
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-full max-w-md" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Stethoscope className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSpecialization("All");
                        }}
                      >
                        Clear filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onBook={() => handleBookDoctor(doctor.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
