import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Phone, MapPin, Heart } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

/**
 * Interactive Doctor Card dengan:
 * - Hover zoom effect
 * - Fade-in animation saat scroll
 * - Favorite toggle
 * - Responsive untuk semua ukuran layar
 */
const InteractiveDoctorCard = ({ doctor, featured = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { elementRef, isVisible } = useIntersectionObserver();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          featured
            ? 'hover:shadow-2xl hover:scale-105'
            : 'hover:shadow-xl hover:scale-102'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient overlay saat hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 transition-all duration-300 ${
            isHovered ? 'from-primary/10 to-primary/15' : ''
          }`}
        />

        <CardContent className="relative p-4 sm:p-6">
          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 transition-transform duration-200 hover:scale-110"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-200 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-300 hover:text-red-400'
              }`}
            />
          </button>

          {/* Doctor avatar dengan zoom effect */}
          <div className="flex justify-center mb-4">
            <div className={`transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}>
              <Avatar className={`${featured ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-20 w-20 sm:h-24 sm:w-24'} border-4 border-primary/20`}>
                <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary text-lg sm:text-xl font-semibold">
                  {getInitials(doctor.name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Doctor info */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Dr. {doctor.name}
            </h3>

            {/* Specialization badge dengan hover effect */}
            <Badge
              variant="secondary"
              className={`mt-2 transition-all duration-300 ${
                isHovered ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              {doctor.specialization}
            </Badge>

            {/* Schedule info */}
            <div className="mt-3 flex items-center justify-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{doctor.schedule}</span>
            </div>

            {/* Bio preview - visible hanya pada desktop */}
            <p className="hidden sm:block mt-3 text-xs sm:text-sm text-gray-600 line-clamp-2 max-w-xs">
              {doctor.bio}
            </p>

            {/* CTA buttons */}
            <div className="mt-4 w-full flex flex-col gap-2">
              <Link href="/book-appointment">
                <Button
                  className={`w-full transition-all duration-300 text-xs sm:text-sm ${
                    isHovered ? 'shadow-lg' : ''
                  }`}
                >
                  Pesan Janji Temu
                </Button>
              </Link>

              {/* View profile button - visible hanya pada layar besar */}
              <Button
                variant="outline"
                className="hidden sm:block w-full text-xs transition-all duration-300 hover:bg-primary/10"
              >
                Lihat Profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveDoctorCard;
