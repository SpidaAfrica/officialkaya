import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages = 10, // fallback if not provided
  onPageChange,
}) => {
  const generatePages = () => {
    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {generatePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage
              ? "bg-primary text-white border-primary"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;



{/*
import React from "react";

export default function Pagination() {
  return (
    <div className="my-5 py-5 flex items-center justify-center">
      <svg
        width="355"
        height="31"
        viewBox="0 0 355 31"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.61084 14.4134L13.1414 17.944L13.9459 17.1396L11.2196 14.4134L13.9459 11.6872L13.1414 10.8828L9.61084 14.4134ZM12.8245 14.4134L16.3551 17.944L17.1595 17.1396L14.4333 14.4134L17.1595 11.6872L16.3551 10.8828L12.8245 14.4134Z"
          fill="#0A0D14"
        />
        <path
          d="M45.7973 14.4133L48.8381 17.4541L47.9695 18.3228L44.0601 14.4133L47.9695 10.5039L48.8381 11.3725L45.7973 14.4133Z"
          fill="#525866"
        />
        <g filter="url(#filter0_d_509_13960)">
          <rect
            x="66.1064"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="66.516"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M80.4679 9.57443V17.9141H79.2056V10.8368H79.1567L77.1614 12.1398V10.9345L79.2422 9.57443H80.4679Z"
            fill="#525866"
          />
        </g>
        <g filter="url(#filter1_d_509_13960)">
          <rect
            x="98.8691"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="#F6F8FA"
          />
          <rect
            x="99.2787"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M109.26 17.9141V17.0019L112.082 14.0782C112.384 13.7605 112.632 13.4823 112.828 13.2434C113.026 13.0018 113.174 12.7724 113.271 12.5552C113.369 12.338 113.418 12.1073 113.418 11.8629C113.418 11.586 113.353 11.3471 113.222 11.1463C113.092 10.9427 112.914 10.7866 112.689 10.678C112.464 10.5667 112.21 10.511 111.928 10.511C111.629 10.511 111.368 10.5721 111.146 10.6943C110.923 10.8164 110.752 10.9888 110.633 11.2114C110.513 11.434 110.453 11.6946 110.453 11.9932H109.252C109.252 11.4856 109.369 11.0417 109.602 10.6617C109.836 10.2816 110.156 9.98707 110.563 9.77804C110.971 9.56629 111.433 9.46041 111.952 9.46041C112.476 9.46041 112.937 9.56493 113.337 9.77396C113.738 9.98028 114.052 10.2626 114.277 10.621C114.502 10.9766 114.615 11.3784 114.615 11.8263C114.615 12.1358 114.557 12.4385 114.44 12.7344C114.326 13.0303 114.126 13.3601 113.841 13.7239C113.556 14.0849 113.16 14.5234 112.652 15.0392L110.995 16.7739V16.835H114.75V17.9141H109.26Z"
            fill="#0A0D14"
          />
        </g>
        <g filter="url(#filter2_d_509_13960)">
          <rect
            x="131.632"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="132.042"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M141.759 15.7396H143.033C143.061 15.9975 143.149 16.2174 143.298 16.3992C143.45 16.5784 143.648 16.7142 143.893 16.8065C144.137 16.8988 144.408 16.9449 144.707 16.9449C145.027 16.9449 145.314 16.8906 145.566 16.782C145.821 16.6734 146.022 16.5133 146.169 16.3015C146.316 16.0898 146.389 15.8292 146.389 15.5197C146.389 15.2428 146.322 14.9876 146.189 14.7541C146.056 14.5207 145.847 14.3333 145.562 14.1922C145.277 14.051 144.905 13.9804 144.446 13.9804H143.701V13.0276L145.705 10.7146V10.6535H142.17V9.57443H147.35V10.4866L145.118 13.0438V13.109C145.504 13.1334 145.853 13.2135 146.165 13.3493C146.48 13.485 146.749 13.6642 146.971 13.8868C147.194 14.1067 147.365 14.3591 147.484 14.6442C147.604 14.9292 147.663 15.2346 147.663 15.5604C147.663 16.0409 147.536 16.4671 147.281 16.839C147.025 17.2109 146.674 17.5028 146.226 17.7145C145.781 17.9236 145.27 18.0281 144.695 18.0281C144.16 18.0281 143.675 17.9358 143.241 17.7512C142.809 17.5666 142.461 17.3032 142.195 16.9612C141.931 16.6191 141.786 16.2119 141.759 15.7396Z"
            fill="#525866"
          />
        </g>
        <g filter="url(#filter3_d_509_13960)">
          <rect
            x="164.395"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="164.805"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M174.376 16.2852V15.2672L177.98 9.57443H178.782V11.073H178.273L175.695 15.1532V15.2183H180.635V16.2852H174.376ZM178.33 17.9141V15.9757L178.338 15.5115V9.57443H179.531V17.9141H178.33Z"
            fill="#525866"
          />
        </g>
        <g filter="url(#filter4_d_509_13960)">
          <rect
            x="197.158"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="197.567"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M210.262 18.0281C209.752 18.0281 209.293 17.9304 208.886 17.7349C208.482 17.5367 208.159 17.2652 207.917 16.9205C207.675 16.5757 207.546 16.1821 207.53 15.7396H208.752C208.782 16.0979 208.94 16.3925 209.228 16.6232C209.516 16.854 209.861 16.9693 210.262 16.9693C210.583 16.9693 210.866 16.896 211.114 16.7494C211.363 16.6001 211.559 16.3952 211.7 16.1346C211.844 15.8739 211.916 15.5767 211.916 15.2428C211.916 14.9034 211.842 14.6007 211.696 14.3347C211.549 14.0687 211.347 13.8596 211.089 13.7076C210.834 13.5556 210.541 13.4782 210.21 13.4755C209.957 13.4755 209.703 13.5189 209.448 13.6058C209.193 13.6927 208.987 13.8067 208.829 13.9479L207.677 13.7768L208.145 9.57443H212.73V10.6535H209.192L208.927 12.9868H208.976C209.139 12.8294 209.354 12.6977 209.623 12.5918C209.895 12.486 210.185 12.433 210.495 12.433C211.002 12.433 211.454 12.5538 211.851 12.7955C212.25 13.0371 212.563 13.3669 212.791 13.785C213.022 14.2003 213.136 14.6781 213.133 15.2183C213.136 15.7586 213.014 16.2404 212.767 16.6639C212.522 17.0874 212.183 17.4213 211.749 17.6657C211.317 17.9073 210.822 18.0281 210.262 18.0281Z"
            fill="#525866"
          />
        </g>
        <g filter="url(#filter5_d_509_13960)">
          <rect
            x="229.92"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="230.33"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M239.844 17.9914C239.621 17.9914 239.43 17.9127 239.27 17.7553C239.11 17.5951 239.03 17.4023 239.03 17.177C239.03 16.9544 239.11 16.7644 239.27 16.6069C239.43 16.4468 239.621 16.3667 239.844 16.3667C240.067 16.3667 240.258 16.4468 240.418 16.6069C240.578 16.7644 240.658 16.9544 240.658 17.177C240.658 17.3263 240.62 17.4634 240.544 17.5883C240.471 17.7105 240.373 17.8082 240.251 17.8815C240.129 17.9548 239.993 17.9914 239.844 17.9914ZM243.023 17.9914C242.8 17.9914 242.609 17.9127 242.448 17.7553C242.288 17.5951 242.208 17.4023 242.208 17.177C242.208 16.9544 242.288 16.7644 242.448 16.6069C242.609 16.4468 242.8 16.3667 243.023 16.3667C243.245 16.3667 243.437 16.4468 243.597 16.6069C243.757 16.7644 243.837 16.9544 243.837 17.177C243.837 17.3263 243.799 17.4634 243.723 17.5883C243.65 17.7105 243.552 17.8082 243.43 17.8815C243.308 17.9548 243.172 17.9914 243.023 17.9914ZM246.201 17.9914C245.979 17.9914 245.787 17.9127 245.627 17.7553C245.467 17.5951 245.387 17.4023 245.387 17.177C245.387 16.9544 245.467 16.7644 245.627 16.6069C245.787 16.4468 245.979 16.3667 246.201 16.3667C246.424 16.3667 246.615 16.4468 246.775 16.6069C246.936 16.7644 247.016 16.9544 247.016 17.177C247.016 17.3263 246.978 17.4634 246.902 17.5883C246.828 17.7105 246.731 17.8082 246.609 17.8815C246.486 17.9548 246.351 17.9914 246.201 17.9914Z"
            fill="#525866"
          />
        </g>
        <g filter="url(#filter6_d_509_13960)">
          <rect
            x="262.684"
            y="1"
            width="26.2103"
            height="26.8289"
            rx="4.91443"
            fill="white"
          />
          <rect
            x="263.093"
            y="1.40954"
            width="25.3912"
            height="26.0098"
            rx="4.50489"
            stroke="#E2E4E9"
            stroke-width="0.819071"
          />
          <path
            d="M275.719 9.46041C276.091 9.46313 276.458 9.531 276.819 9.66402C277.18 9.79704 277.505 10.0142 277.796 10.3156C278.089 10.6169 278.323 11.0241 278.496 11.5372C278.673 12.0475 278.762 12.6828 278.765 13.4429C278.765 14.1732 278.692 14.8233 278.545 15.3934C278.399 15.9608 278.188 16.44 277.914 16.8309C277.643 17.2218 277.313 17.5191 276.924 17.7227C276.536 17.9263 276.099 18.0281 275.613 18.0281C275.116 18.0281 274.675 17.9304 274.29 17.7349C273.904 17.5394 273.591 17.2693 273.349 16.9245C273.108 16.5771 272.957 16.178 272.897 15.7274H274.139C274.221 16.0857 274.386 16.3762 274.636 16.5988C274.888 16.8187 275.214 16.9286 275.613 16.9286C276.224 16.9286 276.7 16.6626 277.043 16.1305C277.385 15.5957 277.557 14.8491 277.56 13.8908H277.495C277.353 14.1243 277.177 14.3252 276.965 14.4935C276.756 14.6618 276.521 14.7921 276.261 14.8844C276 14.9767 275.722 15.0229 275.426 15.0229C274.945 15.0229 274.508 14.9048 274.115 14.6686C273.721 14.4324 273.408 14.108 273.174 13.6954C272.941 13.2827 272.824 12.8117 272.824 12.2824C272.824 11.7557 272.943 11.2779 273.182 10.849C273.424 10.4201 273.76 10.0807 274.192 9.83097C274.626 9.5785 275.135 9.45498 275.719 9.46041ZM275.723 10.5192C275.406 10.5192 275.119 10.5979 274.864 10.7553C274.612 10.9101 274.412 11.1205 274.265 11.3865C274.119 11.6498 274.045 11.943 274.045 12.2661C274.045 12.5891 274.116 12.8823 274.257 13.1456C274.401 13.4063 274.597 13.6139 274.844 13.7687C275.093 13.9207 275.378 13.9967 275.699 13.9967C275.938 13.9967 276.16 13.9506 276.367 13.8583C276.573 13.766 276.753 13.6384 276.908 13.4755C277.063 13.3099 277.184 13.1226 277.271 12.9135C277.357 12.7045 277.401 12.4846 277.401 12.2539C277.401 11.9471 277.328 11.6621 277.181 11.3987C277.037 11.1354 276.839 10.9236 276.586 10.7635C276.334 10.6006 276.046 10.5192 275.723 10.5192Z"
            fill="#525866"
          />
        </g>
        <path
          d="M309.203 14.4133L306.163 11.3725L307.031 10.5039L310.941 14.4133L307.031 18.3228L306.163 17.4541L309.203 14.4133Z"
          fill="#525866"
        />
        <path
          d="M345.389 14.4134L341.859 10.8828L341.054 11.6872L343.781 14.4134L341.054 17.1396L341.859 17.944L345.389 14.4134ZM342.176 14.4134L338.645 10.8828L337.841 11.6872L340.567 14.4134L337.841 17.1396L338.645 17.944L342.176 14.4134Z"
          fill="#0A0D14"
        />
        <defs>
          <filter
            id="filter0_d_509_13960"
            x="64.1064"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter1_d_509_13960"
            x="96.8691"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter2_d_509_13960"
            x="129.632"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter3_d_509_13960"
            x="162.395"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter4_d_509_13960"
            x="195.158"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter5_d_509_13960"
            x="227.92"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
          <filter
            id="filter6_d_509_13960"
            x="260.684"
            y="0"
            width="30.2104"
            height="30.8281"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.894118 0 0 0 0 0.898039 0 0 0 0 0.905882 0 0 0 0.24 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_509_13960"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_509_13960"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
  */}
