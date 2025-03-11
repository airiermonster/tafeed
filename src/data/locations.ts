// Tanzania administrative hierarchy data
// Note: This is a simplified version with sample data
// In a real application, this would be more comprehensive

export interface Ward {
  name: string;
  villages?: string[]; // Villages in the ward, if available
}

export interface District {
  name: string;
  wards: Ward[];
}

export interface Region {
  name: string;
  districts: District[];
}

// Sample data for Tanzania regions
// Focusing on Arusha region with some detailed data
export const tanzaniaRegions: Region[] = [
  {
    name: "Arusha",
    districts: [
      {
        name: "Arusha City",
        wards: [
          { name: "Baraa", villages: ["Baraa Kaskazini", "Baraa Kusini"] },
          { name: "Daraja Mbili", villages: ["Daraja Mbili", "Ngarenaro"] },
          { name: "Elerai", villages: ["Elerai", "Sakina"] },
          { name: "Engutoto", villages: ["Engutoto", "Oloirien"] },
          { name: "Kimandolu", villages: ["Kimandolu", "Mianzini"] },
          { name: "Lemala", villages: ["Lemala Kusini", "Lemala Kaskazini"] },
          { name: "Ngarenaro", villages: ["Ngarenaro A", "Ngarenaro B"] },
          { name: "Oloirien", villages: ["Oloirien Kaskazini", "Oloirien Kusini"] },
          { name: "Sekei", villages: ["Sekei A", "Sekei B"] },
          { name: "Sokon I", villages: ["Sokon I", "Muriet"] },
          { name: "Sombetini", villages: ["Sombetini", "Lemara"] },
          { name: "Themi", villages: ["Themi Kusini", "Themi Kaskazini"] }
        ]
      },
      {
        name: "Arusha District",
        wards: [
          { name: "Ilkiding'a", villages: ["Ilkiding'a", "Oloitushula"] },
          { name: "Kimnyaki", villages: ["Kimnyaki", "Olkokola"] },
          { name: "Kiranyi", villages: ["Kiranyi", "Oltrumet"] },
          { name: "Leguruki", villages: ["Leguruki", "Nguruma"] },
          { name: "Moshono", villages: ["Moshono", "Kisongo"] },
          { name: "Mateves", villages: ["Mateves", "Oljoro"] },
          { name: "Mlangarini", villages: ["Mlangarini", "Mwandet"] },
          { name: "Moivo", villages: ["Moivo", "Nduruma"] },
          { name: "Oldonyosambu", villages: ["Oldonyosambu", "Engalaoni"] }
        ]
      },
      {
        name: "Karatu",
        wards: [
          { name: "Endabash", villages: ["Endabash", "Buger"] },
          { name: "Endamaghang", villages: ["Endamaghang", "Kainam"] },
          { name: "Ganako", villages: ["Ganako", "Qaru"] },
          { name: "Karatu", villages: ["Karatu Mjini", "Karatu Vijijini"] },
          { name: "Kansay", villages: ["Kansay", "Mikocheni"] },
          { name: "Mbulumbulu", villages: ["Mbulumbulu", "Rhotia"] }
        ]
      },
      {
        name: "Longido",
        wards: [
          { name: "Engarenaibor", villages: ["Engarenaibor", "Mundarara"] },
          { name: "Engikaret", villages: ["Engikaret", "Eleng'ata Dapash"] },
          { name: "Gelai Lumbwa", villages: ["Gelai Lumbwa", "Kitarini"] },
          { name: "Gelai Meirugoi", villages: ["Gelai Meirugoi", "Kiserian"] },
          { name: "Longido", villages: ["Longido", "Kimokouwa"] },
          { name: "Matale", villages: ["Matale", "Ngoswak"] },
          { name: "Olmolog", villages: ["Olmolog", "Tingatinga"] },
          { name: "Orbomba", villages: ["Orbomba", "Sakala"] }
        ]
      },
      {
        name: "Monduli",
        wards: [
          { name: "Engutoto", villages: ["Engutoto", "Emairete"] },
          { name: "Engaruka", villages: ["Engaruka Chini", "Engaruka Juu"] },
          { name: "Lepurko", villages: ["Lepurko", "Naalarami"] },
          { name: "Lolkisale", villages: ["Lolkisale", "Mswakini"] },
          { name: "Makuyuni", villages: ["Makuyuni", "Mswakini Juu"] },
          { name: "Monduli Juu", villages: ["Monduli Juu", "Emairete"] },
          { name: "Monduli Mjini", villages: ["Monduli Mjini", "Engutoto"] },
          { name: "Mto wa Mbu", villages: ["Mto wa Mbu", "Migombani"] }
        ]
      },
      {
        name: "Ngorongoro",
        wards: [
          { name: "Alailelai", villages: ["Alailelai", "Olpiro"] },
          { name: "Enduleni", villages: ["Enduleni", "Naiyobi"] },
          { name: "Kakesio", villages: ["Kakesio", "Irkeepusi"] },
          { name: "Nainokanoka", villages: ["Nainokanoka", "Bulati"] },
          { name: "Ngorongoro", villages: ["Ngorongoro", "Kimba"] },
          { name: "Olbalbal", villages: ["Olbalbal", "Meshili"] },
          { name: "Orgosorok", villages: ["Orgosorok", "Masusu"] },
          { name: "Sale", villages: ["Sale", "Samunge"] }
        ]
      }
    ]
  },
  {
    name: "Dar es Salaam",
    districts: [
      {
        name: "Ilala",
        wards: [
          { name: "Buguruni", villages: [] },
          { name: "Chanika", villages: [] },
          { name: "Gerezani", villages: [] },
          { name: "Ilala", villages: [] },
          { name: "Jangwani", villages: [] },
          { name: "Kariakoo", villages: [] },
          { name: "Kipawa", villages: [] },
          { name: "Kisutu", villages: [] },
          { name: "Kitunda", villages: [] },
          { name: "Kivukoni", villages: [] },
          { name: "Mchikichini", villages: [] },
          { name: "Msongola", villages: [] },
          { name: "Pugu", villages: [] },
          { name: "Segerea", villages: [] },
          { name: "Tabata", villages: [] },
          { name: "Ukonga", villages: [] },
          { name: "Upanga Magharibi", villages: [] },
          { name: "Upanga Mashariki", villages: [] },
          { name: "Vingunguti", villages: [] }
        ]
      },
      {
        name: "Kinondoni",
        wards: [
          { name: "Bunju", villages: [] },
          { name: "Goba", villages: [] },
          { name: "Hananasif", villages: [] },
          { name: "Kawe", villages: [] },
          { name: "Kibamba", villages: [] },
          { name: "Kigogo", villages: [] },
          { name: "Kijitonyama", villages: [] },
          { name: "Kimara", villages: [] },
          { name: "Kinondoni", villages: [] },
          { name: "Kunduchi", villages: [] },
          { name: "Mabibo", villages: [] },
          { name: "Magomeni", villages: [] },
          { name: "Makuburi", villages: [] },
          { name: "Makumbusho", villages: [] },
          { name: "Makurumla", villages: [] },
          { name: "Manzese", villages: [] },
          { name: "Mbezi", villages: [] },
          { name: "Mburahati", villages: [] },
          { name: "Mbweni", villages: [] },
          { name: "Mikocheni", villages: [] },
          { name: "Msasani", villages: [] },
          { name: "Mwananyamala", villages: [] },
          { name: "Mzimuni", villages: [] },
          { name: "Ndugumbi", villages: [] },
          { name: "Sinza", villages: [] },
          { name: "Tandale", villages: [] },
          { name: "Ubungo", villages: [] }
        ]
      },
      {
        name: "Temeke",
        wards: [
          { name: "Azimio", villages: [] },
          { name: "Chamazi", villages: [] },
          { name: "Chang'ombe", villages: [] },
          { name: "Charambe", villages: [] },
          { name: "Keko", villages: [] },
          { name: "Kibada", villages: [] },
          { name: "Kigamboni", villages: [] },
          { name: "Kimbiji", villages: [] },
          { name: "Kisarawe II", villages: [] },
          { name: "Kurasini", villages: [] },
          { name: "Makangarawe", villages: [] },
          { name: "Mbagala", villages: [] },
          { name: "Mbagala Kuu", villages: [] },
          { name: "Miburani", villages: [] },
          { name: "Mtoni", villages: [] },
          { name: "Pemba Mnazi", villages: [] },
          { name: "Sandali", villages: [] },
          { name: "Somangila", villages: [] },
          { name: "Tandika", villages: [] },
          { name: "Temeke", villages: [] },
          { name: "Toangoma", villages: [] },
          { name: "Vijibweni", villages: [] },
          { name: "Yombo Vituka", villages: [] }
        ]
      }
    ]
  },
  {
    name: "Dodoma",
    districts: [
      {
        name: "Bahi",
        wards: [
          { name: "Bahi", villages: [] },
          { name: "Chipanga", villages: [] },
          { name: "Ibihwa", villages: [] },
          { name: "Kigwe", villages: [] },
          { name: "Mpamantwa", villages: [] },
          { name: "Mwitikira", villages: [] },
          { name: "Zanka", villages: [] }
        ]
      },
      {
        name: "Chamwino",
        wards: [
          { name: "Buigiri", villages: [] },
          { name: "Chamwino", villages: [] },
          { name: "Haneti", villages: [] },
          { name: "Ikowa", villages: [] },
          { name: "Itiso", villages: [] },
          { name: "Majeleko", villages: [] },
          { name: "Makang'wa", villages: [] },
          { name: "Manchali", villages: [] },
          { name: "Membe", villages: [] },
          { name: "Mlowa Bwawani", villages: [] },
          { name: "Mpwayungu", villages: [] },
          { name: "Msanga", villages: [] },
          { name: "Msamalo", villages: [] },
          { name: "Mvumi Makulu", villages: [] },
          { name: "Mvumi Mission", villages: [] },
          { name: "Nghambaku", villages: [] }
        ]
      },
      {
        name: "Dodoma Urban",
        wards: [
          { name: "Chigongwe", villages: [] },
          { name: "Dodoma Makulu", villages: [] },
          { name: "Hombolo", villages: [] },
          { name: "Ipala", villages: [] },
          { name: "Kikombo", villages: [] },
          { name: "Kizota", villages: [] },
          { name: "Mbabala", villages: [] },
          { name: "Mkonze", villages: [] },
          { name: "Mpunguzi", villages: [] },
          { name: "Msalato", villages: [] },
          { name: "Mtumba", villages: [] },
          { name: "Nala", villages: [] },
          { name: "Ng'hong'onha", villages: [] },
          { name: "Ntyuka", villages: [] },
          { name: "Nzuguni", villages: [] },
          { name: "Tambukareli", villages: [] },
          { name: "Viwandani", villages: [] },
          { name: "Zuzu", villages: [] }
        ]
      }
    ]
  },
  {
    name: "Iringa",
    districts: [
      {
        name: "Iringa Rural",
        wards: []
      },
      {
        name: "Iringa Urban",
        wards: []
      },
      {
        name: "Kilolo",
        wards: []
      },
      {
        name: "Mufindi",
        wards: []
      }
    ]
  },
  {
    name: "Kagera",
    districts: [
      {
        name: "Biharamulo",
        wards: []
      },
      {
        name: "Bukoba Rural",
        wards: []
      },
      {
        name: "Bukoba Urban",
        wards: []
      },
      {
        name: "Karagwe",
        wards: []
      },
      {
        name: "Kyerwa",
        wards: []
      },
      {
        name: "Missenyi",
        wards: []
      },
      {
        name: "Muleba",
        wards: []
      },
      {
        name: "Ngara",
        wards: []
      }
    ]
  },
  {
    name: "Kigoma",
    districts: [
      {
        name: "Buhigwe",
        wards: []
      },
      {
        name: "Kakonko",
        wards: []
      },
      {
        name: "Kasulu",
        wards: []
      },
      {
        name: "Kibondo",
        wards: []
      },
      {
        name: "Kigoma Urban",
        wards: []
      },
      {
        name: "Kigoma Rural",
        wards: []
      },
      {
        name: "Uvinza",
        wards: []
      }
    ]
  },
  {
    name: "Kilimanjaro",
    districts: []
  },
  {
    name: "Lindi",
    districts: []
  },
  {
    name: "Manyara",
    districts: []
  },
  {
    name: "Mara",
    districts: []
  },
  {
    name: "Mbeya",
    districts: []
  },
  {
    name: "Morogoro",
    districts: []
  },
  {
    name: "Mtwara",
    districts: []
  },
  {
    name: "Mwanza",
    districts: []
  },
  {
    name: "Njombe",
    districts: []
  },
  {
    name: "Pwani",
    districts: []
  },
  {
    name: "Rukwa",
    districts: []
  },
  {
    name: "Ruvuma",
    districts: []
  },
  {
    name: "Shinyanga",
    districts: []
  },
  {
    name: "Simiyu",
    districts: []
  },
  {
    name: "Singida",
    districts: []
  },
  {
    name: "Songwe",
    districts: []
  },
  {
    name: "Tabora",
    districts: []
  },
  {
    name: "Tanga",
    districts: []
  },
  {
    name: "Zanzibar Central/South",
    districts: []
  },
  {
    name: "Zanzibar North",
    districts: []
  },
  {
    name: "Zanzibar Urban/West",
    districts: []
  },
  {
    name: "Pemba North",
    districts: []
  },
  {
    name: "Pemba South",
    districts: []
  }
]; 