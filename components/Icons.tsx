
import React from 'react';

export const TagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
);

export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const AmazonLogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm229.8 610.9c-61.9 66.8-164.2 108.3-273.7 108.3-152.3 0-281.2-111.3-308.2-259.9-1.9-10.4 6.3-19.5 16.7-19.5h57.4c9.3 0 17.4 6.9 19.1 16.2 21.4 113.8 123.5 200.2 247.7 200.2 62.5 0 119.5-22.6 163.6-60.2 7.7-6.6 19.4-1.6 19.4 8.3v50.9c0 9.2-8.9 15.8-17 12.7zM362 519.3c0-112.9 83.3-205.9 191.6-218.4 10.2-1.2 18.4 6.7 18.4 17.1V512c0 11-8.9 20-20 20H382c-11 0-20-9-20-20v-12.7zm400-61.6c-27-148.6-155.9-259.9-308.2-259.9-109.5 0-211.8 41.5-273.7 108.3-8.1 8.8-2.5 23.1 9.4 23.1h51c10.4 0 18.8-7.5 20.4-17.8 21.3-131.2 143.2-227.6 284-227.6 124.2 0 226.3 86.4 247.7 200.2 1.7 9.3 9.8 16.2 19.1 16.2h57.4c10.4 0 18.6-9.1 16.7-19.5z"></path>
    </svg>
);

export const FlipkartLogo: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L5.41 12 11 7.41V10h7v4h-7v2.59z" fill="currentColor"></path>
    </svg>
);

export const ChevronLeftIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);
