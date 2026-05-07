type LogoStarProps = {
  className?: string;
};

/** Four-point star used beside the Dark Star wordmark in the header. */
export function LogoStar({ className }: LogoStarProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 65.29 65.32"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M30.88,9.08c.5-1.79,3.04-1.79,3.53,0l3.66,13.06c.69,2.46,2.61,4.39,5.07,5.09l13.03,3.67c1.78.5,1.78,3.03,0,3.53l-13.03,3.67c-2.46.7-4.38,2.62-5.07,5.08l-3.66,13.06c-.5,1.79-3.03,1.79-3.53,0l-3.65-13.06c-.69-2.46-2.61-4.39-5.07-5.08l-13.03-3.67c-1.78-.5-1.78-3.03,0-3.53l13.03-3.67c2.46-.7,4.38-2.62,5.07-5.09l3.65-13.06Z"
      />
    </svg>
  );
}
