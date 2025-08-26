import React from 'react';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Tamil Nadu Districts and their major cities/towns mapping
const districtCityMapping: { [key: string]: Array<{ id: string; name: string }> } = {
  'chennai': [
    { id: 'chennai-city', name: 'Chennai City' },
    { id: 'tambaram', name: 'Tambaram' },
    { id: 'ambattur', name: 'Ambattur' },
    { id: 'avadi', name: 'Avadi' }
  ],
  'coimbatore': [
    { id: 'coimbatore-city', name: 'Coimbatore City' },
    { id: 'pollachi', name: 'Pollachi' },
    { id: 'mettupalayam', name: 'Mettupalayam' },
    { id: 'sulur', name: 'Sulur' }
  ],
  'madurai': [
    { id: 'madurai-city', name: 'Madurai City' },
    { id: 'dindigul', name: 'Dindigul' },
    { id: 'theni', name: 'Theni' },
    { id: 'usilampatti', name: 'Usilampatti' }
  ],
  'salem': [
    { id: 'salem-city', name: 'Salem City' },
    { id: 'attur', name: 'Attur' },
    { id: 'mettur', name: 'Mettur' },
    { id: 'yercaud', name: 'Yercaud' }
  ],
  'tirupur': [
    { id: 'tirupur-city', name: 'Tirupur City' },
    { id: 'avinashi', name: 'Avinashi' },
    { id: 'dharapuram', name: 'Dharapuram' },
    { id: 'kangeyam', name: 'Kangeyam' }
  ],
  'erode': [
    { id: 'erode-city', name: 'Erode City' },
    { id: 'gobichettipalayam', name: 'Gobichettipalayam' },
    { id: 'sathyamangalam', name: 'Sathyamangalam' },
    { id: 'bhavani', name: 'Bhavani' }
  ],
  'vellore': [
    { id: 'vellore-city', name: 'Vellore City' },
    { id: 'katpadi', name: 'Katpadi' },
    { id: 'gudiyatham', name: 'Gudiyatham' },
    { id: 'ambur', name: 'Ambur' }
  ],
  'thanjavur': [
    { id: 'thanjavur-city', name: 'Thanjavur City' },
    { id: 'kumbakonam', name: 'Kumbakonam' },
    { id: 'pattukottai', name: 'Pattukottai' },
    { id: 'orathanadu', name: 'Orathanadu' }
  ],
  'tiruchirappalli': [
    { id: 'trichy-city', name: 'Trichy City' },
    { id: 'srirangam', name: 'Srirangam' },
    { id: 'lalgudi', name: 'Lalgudi' },
    { id: 'musiri', name: 'Musiri' }
  ],
  'kanyakumari': [
    { id: 'nagercoil', name: 'Nagercoil' },
    { id: 'kanyakumari-town', name: 'Kanyakumari Town' },
    { id: 'padmanabhapuram', name: 'Padmanabhapuram' },
    { id: 'marthandam', name: 'Marthandam' }
  ],
  'tirunelveli': [
    { id: 'tirunelveli-city', name: 'Tirunelveli City' },
    { id: 'palayamkottai', name: 'Palayamkottai' },
    { id: 'sankarankovil', name: 'Sankarankovil' },
    { id: 'ambasamudram', name: 'Ambasamudram' }
  ],
  'cuddalore': [
    { id: 'cuddalore-city', name: 'Cuddalore City' },
    { id: 'chidambaram', name: 'Chidambaram' },
    { id: 'vridhachalam', name: 'Vridhachalam' },
    { id: 'neyveli', name: 'Neyveli' }
  ]
};

interface CitySelectProps {
  selectedDistrict: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({
  selectedDistrict,
  value,
  onValueChange,
  placeholder = "Select city/town"
}) => {
  const cities = selectedDistrict ? districtCityMapping[selectedDistrict] || [] : [];
  
  if (!selectedDistrict || cities.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full bg-muted/50 border-primary/10">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="First select a district" />
          </div>
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-card shadow-md hover:shadow-lg transition-smooth border-primary/20 focus:border-primary">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 bg-card border-primary/20 shadow-xl">
        {cities.map((city) => (
          <SelectItem 
            key={city.id} 
            value={city.id}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
          >
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};