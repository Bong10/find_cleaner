'use client';

import FooterDefault from "../../footer/common-footer";
import Breadcrumb from "../../common/Breadcrumb";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";

import FilterTopBox from "./FilterTopBox";
import FilterSidebar from "./FilterSidebar";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addKeyword,
  addLocation,
  addDestination,
} from "../../../features/filter/candidateFilterSlice";
import { fetchCleaners, setSelectedCleaner } from "@/store/slices/usersSlice";

const Index = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get cleaners data from Redux store
  const { cleaners, loading, error } = useSelector((state) => state.users);

  // Redux filter state
  const {
    keyword,
    location,
    destination,
    experiences,
    sort,
    perPage,
  } = useSelector((state) => state.candidateFilter) || {};

  /* ----------------------------------------------------
   * Fetch cleaners using Redux thunk
   * ---------------------------------------------------- */
  useEffect(() => {
    dispatch(fetchCleaners());
  }, [dispatch]);

  // Function to handle cleaner selection
  const handleViewProfile = (cleaner) => {
    dispatch(setSelectedCleaner(cleaner));
    localStorage.setItem('selectedCleaner', JSON.stringify(cleaner));
    router.push(`/candidates-single-v1/${cleaner.id || cleaner.user?.id}`);
  };

  /* ----------------------------------------------------
   * Transform cleaners data to match existing structure
   * ---------------------------------------------------- */
  const cleanersData = useMemo(() => {
    if (!cleaners || cleaners.length === 0) return [];
    
    return cleaners.map((cleaner, index) => {
      const userData = cleaner.user || cleaner;
      const cleanerName =
        userData.first_name && userData.last_name
          ? `${userData.first_name} ${userData.last_name}`
          : userData.name || userData.email?.split("@")[0] || `Cleaner ${index + 1}`;

      // Map years of experience to our filter values
      let experienceValue = "entry-level";
      if (cleaner.years_experience) {
        if (cleaner.years_experience < 1) experienceValue = "entry-level";
        else if (cleaner.years_experience <= 2) experienceValue = "1-2-years";
        else if (cleaner.years_experience <= 5) experienceValue = "2-5-years";
        else if (cleaner.years_experience <= 10) experienceValue = "5-10-years";
        else experienceValue = "10-plus-years";
      }

      // Calculate average rating
      const reviewCount = cleaner.reviews?.length || cleaner.review_count || 0;
      const averageRating = cleaner.average_rating || 
                           (cleaner.reviews && cleaner.reviews.length > 0 
                             ? cleaner.reviews.reduce((sum, r) => sum + r.rating, 0) / cleaner.reviews.length 
                             : 0);

      // Create tags
      const baseTags = cleaner.specializations?.slice(0, 3) || ["Domestic", "Deep Clean", "Professional"];
      const ratingTag = reviewCount > 0 ? `★ ${averageRating.toFixed(1)}` : "★ 0.0";
      const tags = [...baseTags, ratingTag];

      // Parse date for sorting
      let createdDate;
      if (userData.date_joined) {
        createdDate = new Date(userData.date_joined);
      } else if (cleaner.created_at) {
        createdDate = new Date(cleaner.created_at);
      } else {
        // Use index to maintain order for items without dates
        createdDate = new Date(Date.now() - (index * 86400000)); // Subtract days based on index
      }

      return {
        ...cleaner,
        id: cleaner.id || userData.id,
        name: cleanerName,
        reviewCount: reviewCount,
        averageRating: averageRating.toFixed(1),
        isVerified: cleaner.is_verified || userData.is_verified || false,
        location: userData.address || "Cambridge, UK",
        destination: { min: 0, max: 100 },
        experience: experienceValue,
        services: cleaner.services || cleaner.specializations || [],
        tags: tags,
        avatar:
          userData.profile_picture &&
          (userData.profile_picture.startsWith("http")
            ? userData.profile_picture
            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${userData.profile_picture}`) ||
          `/images/resource/candidate-${(index % 10) + 1}.png`,
        createdAt: createdDate,
        originalIndex: index, // Keep original index for stable sorting
      };
    });
  }, [cleaners]);

  /* ----------------------------------------------------
   * Initialize filters from URL params
   * ---------------------------------------------------- */
  useEffect(() => {
    const service = searchParams.get("service") || "";
    const loc = searchParams.get("location") || "";
    
    if (service) dispatch(addKeyword(service));
    if (loc) dispatch(addLocation(loc));
    dispatch(addDestination({ min: 0, max: 100 }));
  }, []);

  /* ----------------------------------------------------
   * Apply all filters and sorting
   * ---------------------------------------------------- */
  const visible = useMemo(() => {
    let filtered = [...cleanersData];

    // Keyword filter
    if (keyword && keyword.trim() !== "") {
      const searchTerm = keyword.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(searchTerm);
        const servicesMatch = item.services?.some(service => 
          typeof service === 'string' && service.toLowerCase().includes(searchTerm)
        );
        const tagsMatch = item.tags?.some(tag => 
          typeof tag === 'string' && tag.toLowerCase().includes(searchTerm)
        );
        return nameMatch || servicesMatch || tagsMatch;
      });
    }

    // Location filter
    if (location && location.trim() !== "") {
      const searchLocation = location.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(searchLocation)
      );
    }

    // Experience filter
    if (experiences && experiences.length > 0) {
      filtered = filtered.filter(item => 
        experiences.includes(item.experience)
      );
    }

    // Sorting - Fixed to work properly
    if (sort === "asc") {
      // Oldest first - sort by date ascending
      filtered.sort((a, b) => {
        const dateA = a.createdAt.getTime();
        const dateB = b.createdAt.getTime();
        if (dateA === dateB) {
          // If dates are the same, use original index
          return a.originalIndex - b.originalIndex;
        }
        return dateA - dateB;
      });
    } else if (sort === "des") {
      // Newest first - sort by date descending
      filtered.sort((a, b) => {
        const dateA = a.createdAt.getTime();
        const dateB = b.createdAt.getTime();
        if (dateA === dateB) {
          // If dates are the same, use original index (reversed)
          return b.originalIndex - a.originalIndex;
        }
        return dateB - dateA;
      });
    } else {
      // Default sort - maintain original order
      filtered.sort((a, b) => a.originalIndex - b.originalIndex);
    }

    // Pagination
    if (perPage && perPage.end > 0) {
      const start = perPage.start || 0;
      filtered = filtered.slice(start, start + perPage.end);
    }

    return filtered;
  }, [cleanersData, keyword, location, experiences, sort, perPage]);

  // Use filterCleaners instead of visible
  const visibleCleaners = visible;

  return (
    <>
      <LoginPopup />
      <DefaulHeader2 />
      <MobileMenu />

      <Breadcrumb title="Find Cleaners" meta="Cleaners" />

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filter-sidebar"
              aria-labelledby="offcanvasLabel"
            >
              <div className="filters-column hide-left">
                <FilterSidebar />
              </div>
            </div>

            <div className="filters-column hidden-1023 col-lg-4 col-md-12 col-sm-12">
              <FilterSidebar />
            </div>

            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="ls-outer">
                <FilterTopBox count={visibleCleaners?.length || 0} />

                {loading ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: "20px" }}>Loading cleaners...</p>
                  </div>
                ) : error ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <h4>Error loading cleaners</h4>
                    <p>{error}</p>
                  </div>
                ) : visibleCleaners?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <h4>No cleaners found</h4>
                    <p>Try adjusting your filters or check back later.</p>
                  </div>
                ) : (
                  visibleCleaners?.map((c) => (
                    <div className="candidate-block-three" key={c.id}>
                      <div className="inner-box">
                        <div className="content">
                          <figure className="image">
                            <Image
                              width={90}
                              height={90}
                              src={c.avatar}
                              alt={c.name}
                              onError={(e) => {
                                e.target.src = "/images/resource/candidate-1.png";
                              }}
                            />
                          </figure>

                          <h4 className="name">
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handleViewProfile(c);
                              }}
                            >
                              {c.name}
                            </a>
                          </h4>

                          <ul className="candidate-info">
                            <li>
                              <span className="icon flaticon-map-locator"></span> {c.location}
                            </li>
                            {/* Verification Status */}
                            <li>
                              {c.isVerified ? (
                                <span style={{ color: '#52c41a' }}>
                                  <i className="la la-check-circle"></i> Verified
                                </span>
                              ) : (
                                <span style={{ color: '#696969' }}>
                                  <i className="la la-times-circle"></i> Not Verified
                                </span>
                              )}
                            </li>
                          </ul>

                          <ul className="post-tags">
                            {c.tags.map((t, i) => (
                              <li key={i}>
                                <a href="#">{t}</a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="btn-box">
                          <button className="bookmark-btn me-2" aria-label="Bookmark">
                            <span className="flaticon-bookmark"></span>
                          </button>

                          <button 
                            onClick={() => handleViewProfile(c)}
                            className="theme-btn btn-style-three"
                          >
                            <span className="btn-title">View Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterDefault />
    </>
  );
};

export default Index;