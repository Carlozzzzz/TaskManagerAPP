src/
├── components/
│   ├── ui/                 <-- GENERIC: Atoms (Button, Input, Modal, Table)
│   │
│   ├── shared/             <-- CROSS-DOMAIN: Logic used by 2+ Domains
│   │
│   ├── modules/            <-- THE ENGINE ROOM
│   │   ├── maintenance/    <-- DOMAIN GROUP
│   │   │   ├── clients/    <-- MODULE
│   │   │   ├── locations/
│   │   │   └── companies/
│   │   │
│   │   ├── sales/          <-- DOMAIN GROUP
│   │   │   ├── purchasing/
│   │   │   └── tally/
│   │   │
│   │   ├── home/           <-- STANDALONE MODULE
│   │   └── users/          <-- STANDALONE MODULE
│   │
│   └── layout/             <-- SHELL: Sidebar, Topbar