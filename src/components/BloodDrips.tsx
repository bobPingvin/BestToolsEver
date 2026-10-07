import React, { useEffect, useState } from 'react';

interface Droplet {
  id: number;
  leftPercent: number;
  delay: number;
  duration: number;
  size: number;
}

export const BloodDrips: React.FC = () => {
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  useEffect(() => {
    // Atmospheric falling blood drops positioned directly under the longest stalactite tips
    const initialDrops: Droplet[] = [
      { id: 1, leftPercent: 5.6, delay: 0.2, duration: 2.8, size: 3.5 },
      { id: 2, leftPercent: 18.2, delay: 1.6, duration: 3.2, size: 4 },
      { id: 3, leftPercent: 33.5, delay: 0.8, duration: 3.0, size: 3 },
      { id: 4, leftPercent: 51.4, delay: 2.2, duration: 3.5, size: 4.5 },
      { id: 5, leftPercent: 68.2, delay: 1.1, duration: 3.1, size: 3.5 },
      { id: 6, leftPercent: 82.5, delay: 2.6, duration: 3.4, size: 4 },
      { id: 7, leftPercent: 93.8, delay: 0.5, duration: 2.9, size: 3.2 },
    ];
    setDroplets(initialDrops);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none z-30 select-none overflow-hidden h-16 sm:h-20">
      {/* Top crimson ambient back-glow for rich occult depth */}
      <div 
        className="absolute inset-x-0 top-0 h-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.45) 0%, rgba(185, 28, 28, 0.25) 50%, transparent 100%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main High-Detail Visceral Dripping SVG */}
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 65"
        preserveAspectRatio="none"
        style={{
          filter: 'drop-shadow(0 4px 10px rgba(239, 68, 68, 0.7)) drop-shadow(0 8px 20px rgba(153, 27, 27, 0.5))',
        }}
      >
        <defs>
          {/* Deep dark coagulated blood base */}
          <linearGradient id="coagulatedDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4c0507" />
            <stop offset="50%" stopColor="#310204" />
            <stop offset="100%" stopColor="#180102" />
          </linearGradient>

          {/* Rich visceral crimson red fluid body */}
          <linearGradient id="visceralRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="40%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#680a0e" />
          </linearGradient>

          {/* Arterial bright gloss core */}
          <linearGradient id="arterialCore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="60%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Wet specular light highlight */}
          <linearGradient id="wetHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fca5a5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* LAYER 1: Deep coagulated shadow layer with smooth bulbous stalactites (depth up to y=52) */}
        <path
          d="
            M 0,0 
            L 1440,0 
            L 1440,16
            C 1422,16 1414,24 1407,30 C 1400,36 1395,48 1386,48 C 1377,48 1372,35 1366,28 C 1358,19 1346,16 1328,16
            C 1313,16 1305,23 1298,30 C 1292,38 1286,52 1277,52 C 1268,52 1263,38 1257,30 C 1250,20 1238,16 1218,16
            C 1203,16 1196,24 1190,32 C 1184,40 1179,50 1171,50 C 1163,50 1158,36 1152,27 C 1144,18 1133,16 1113,16
            C 1096,16 1088,21 1082,28 C 1075,36 1069,44 1061,44 C 1053,44 1048,32 1042,24 C 1034,16 1023,15 1003,15
            C 986,15 978,23 971,31 C 964,41 957,54 947,54 C 937,54 931,39 924,29 C 916,19 904,15 883,15
            C 866,15 858,23 851,30 C 845,38 839,48 831,48 C 823,48 818,34 812,26 C 804,17 793,15 773,15
            C 756,15 748,22 741,30 C 734,40 726,55 716,55 C 706,55 700,39 693,29 C 685,19 673,15 653,15
            C 636,15 628,21 621,28 C 615,35 609,44 601,44 C 593,44 588,32 582,24 C 574,16 563,15 543,15
            C 526,15 518,23 511,31 C 504,41 496,53 486,53 C 476,53 470,39 463,29 C 455,19 443,15 423,15
            C 406,15 398,22 391,30 C 385,38 379,46 371,46 C 363,46 358,34 352,26 C 344,17 333,15 313,15
            C 296,15 288,24 281,33 C 274,45 266,56 256,56 C 246,56 240,41 233,30 C 225,19 213,15 193,15
            C 176,15 168,22 161,28 C 155,36 149,44 141,44 C 133,44 128,32 122,25 C 114,17 103,15 83,15
            C 68,15 60,22 53,30 C 46,40 38,54 29,54 C 20,54 15,39 10,29 C 5,19 2,16 0,16
            Z
          "
          fill="url(#coagulatedDark)"
        />

        {/* LAYER 2: Main Rich Crimson Visceral Body */}
        <path
          d="
            M 0,0 
            L 1440,0 
            L 1440,12
            C 1422,12 1414,18 1408,25 C 1403,31 1398,42 1390,42 C 1382,42 1378,30 1372,23 C 1365,16 1353,13 1335,13
            C 1320,13 1312,19 1306,26 C 1300,34 1294,46 1286,46 C 1278,46 1273,34 1267,26 C 1261,17 1249,13 1229,13
            C 1214,13 1206,20 1200,27 C 1194,34 1189,44 1182,44 C 1175,44 1170,32 1164,24 C 1157,15 1145,13 1127,13
            C 1110,13 1102,18 1096,24 C 1090,31 1085,38 1078,38 C 1071,38 1066,28 1060,21 C 1053,14 1041,12 1021,12
            C 1004,12 996,19 989,27 C 983,36 977,48 968,48 C 959,48 953,35 946,26 C 939,16 927,12 907,12
            C 890,12 882,19 876,26 C 870,33 865,42 858,42 C 851,42 846,30 840,22 C 833,14 821,12 801,12
            C 784,12 776,18 769,26 C 762,35 755,49 745,49 C 735,49 729,35 722,25 C 715,15 703,12 683,12
            C 666,12 658,18 652,24 C 646,31 641,38 634,38 C 627,38 622,28 616,21 C 609,14 597,12 577,12
            C 560,12 552,19 545,27 C 539,36 532,47 523,47 C 514,47 508,34 501,25 C 494,15 482,12 462,12
            C 445,12 437,18 431,24 C 425,31 420,40 413,40 C 406,40 401,29 395,22 C 388,14 376,12 356,12
            C 339,12 331,20 324,29 C 318,40 311,50 301,50 C 291,50 285,36 278,26 C 271,16 259,12 239,12
            C 222,12 214,18 208,24 C 202,31 197,38 190,38 C 183,38 178,28 172,21 C 165,14 153,12 133,12
            C 117,12 109,18 102,26 C 96,35 89,46 80,46 C 71,46 66,32 60,23 C 54,14 47,12 34,12
            C 24,12 13,13 0,14
            Z
          "
          fill="url(#visceralRed)"
        />

        {/* LAYER 3: Arterial Bright Gloss Core */}
        <path
          d="
            M 0,0 
            L 1440,0 
            L 1440,8
            C 1420,9 1410,14 1404,19 C 1399,24 1394,34 1388,34 C 1382,34 1378,24 1373,18 C 1367,12 1357,9 1340,9
            C 1324,9 1316,14 1310,20 C 1304,27 1299,38 1291,38 C 1283,38 1279,28 1274,20 C 1268,13 1258,9 1240,9
            C 1224,9 1216,15 1210,21 C 1205,27 1200,36 1195,36 C 1190,36 1186,26 1181,19 C 1175,12 1165,9 1148,9
            C 1018,9 1004,14 997,22 C 991,30 985,40 977,40 C 969,40 965,28 959,19 C 953,12 943,9 924,9
            C 789,9 777,14 771,21 C 765,29 759,41 751,41 C 743,41 739,28 733,20 C 727,12 717,9 697,9
            C 567,9 555,14 549,21 C 543,29 537,39 529,39 C 521,39 517,28 511,19 C 505,12 494,9 474,9
            C 344,9 332,14 326,23 C 320,32 314,42 306,42 C 298,42 294,29 288,20 C 282,12 271,9 251,9
            C 121,9 109,14 103,20 C 97,27 91,38 83,38 C 75,38 71,26 65,18 C 59,11 47,9 27,9
            C 14,9 7,9 0,10
            Z
          "
          fill="url(#arterialCore)"
        />

        {/* LAYER 4: Wet specular glistening reflections on bulbs and ridges */}
        <g stroke="url(#wetHighlight)" strokeWidth="1.8" strokeLinecap="round" fill="none">
          {/* Bulb shine arcs on the longest stalactite tips */}
          <path d="M 27,47 C 28,51 30,52 32,52" />
          <path d="M 77,39 C 78,43 80,44 82,44" />
          <path d="M 254,49 C 255,53 257,54 259,54" />
          <path d="M 299,43 C 300,47 302,48 304,48" />
          <path d="M 484,46 C 485,50 487,51 489,51" />
          <path d="M 521,40 C 522,44 524,45 526,45" />
          <path d="M 714,48 C 715,52 717,53 719,53" />
          <path d="M 743,42 C 744,46 746,47 748,47" />
          <path d="M 945,47 C 946,51 948,52 950,52" />
          <path d="M 966,41 C 967,45 969,46 971,46" />
          <path d="M 1169,43 C 1170,47 1172,48 1174,48" />
          <path d="M 1275,45 C 1276,49 1278,50 1280,50" />
          <path d="M 1384,41 C 1385,45 1387,46 1389,46" />

          {/* Glossy vertical liquid shine streaks */}
          <path d="M 256,22 L 256,44" strokeWidth="1.2" opacity="0.75" />
          <path d="M 716,20 L 716,42" strokeWidth="1.2" opacity="0.75" />
          <path d="M 947,20 L 947,42" strokeWidth="1.2" opacity="0.75" />
          <path d="M 1276,20 L 1276,40" strokeWidth="1.2" opacity="0.75" />
        </g>
      </svg>

      {/* Atmospheric falling blood droplets dipping below the tips */}
      {droplets.map((d) => (
        <div
          key={d.id}
          className="absolute bg-gradient-to-b from-red-500 via-red-600 to-red-950 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.9)]"
          style={{
            left: `${d.leftPercent}%`,
            top: '44px',
            width: `${d.size}px`,
            height: `${d.size * 1.6}px`,
            borderRadius: '50% 50% 60% 60%',
            animation: `viscousBloodDrip ${d.duration}s cubic-bezier(0.5, 0, 0.75, 0.3) infinite`,
            animationDelay: `${d.delay}s`,
          }}
        >
          {/* Micro specular dot on the droplet */}
          <div className="w-1 h-1 bg-white/70 rounded-full ml-0.5 mt-0.5" />
        </div>
      ))}

      <style>{`
        @keyframes viscousBloodDrip {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
            transform: translateY(3px) scale(1);
          }
          70% {
            opacity: 0.75;
            transform: translateY(18px) scale(0.9);
          }
          100% {
            transform: translateY(28px) scale(0.25);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
