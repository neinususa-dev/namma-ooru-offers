import React from 'react';
import { MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const tamilNaduDistricts = [
  { id: 'ariyalur', name: 'Ariyalur' },
  { id: 'chengalpattu', name: 'Chengalpattu' },
  { id: 'chennai', name: 'Chennai' },
  { id: 'coimbatore', name: 'Coimbatore' },
  { id: 'cuddalore', name: 'Cuddalore' },
  { id: 'dharmapuri', name: 'Dharmapuri' },
  { id: 'dindigul', name: 'Dindigul' },
  { id: 'erode', name: 'Erode' },
  { id: 'kallakurichi', name: 'Kallakurichi' },
  { id: 'kanchipuram', name: 'Kanchipuram' },
  { id: 'kanyakumari', name: 'Kanyakumari' },
  { id: 'karur', name: 'Karur' },
  { id: 'krishnagiri', name: 'Krishnagiri' },
  { id: 'madurai', name: 'Madurai' },
  { id: 'mayiladuthurai', name: 'Mayiladuthurai' },
  { id: 'nagapattinam', name: 'Nagapattinam' },
  { id: 'namakkal', name: 'Namakkal' },
  { id: 'nilgiris', name: 'Nilgiris' },
  { id: 'perambalur', name: 'Perambalur' },
  { id: 'pudukkottai', name: 'Pudukkottai' },
  { id: 'ramanathapuram', name: 'Ramanathapuram' },
  { id: 'ranipet', name: 'Ranipet' },
  { id: 'salem', name: 'Salem' },
  { id: 'sivaganga', name: 'Sivaganga' },
  { id: 'tenkasi', name: 'Tenkasi' },
  { id: 'thanjavur', name: 'Thanjavur' },
  { id: 'theni', name: 'Theni' },
  { id: 'thoothukudi', name: 'Thoothukudi' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli' },
  { id: 'tirunelveli', name: 'Tirunelveli' },
  { id: 'tirupattur', name: 'Tirupattur' },
  { id: 'tiruppur', name: 'Tiruppur' },
  { id: 'tiruvallur', name: 'Tiruvallur' },
  { id: 'tiruvannamalai', name: 'Tiruvannamalai' },
  { id: 'tiruvarur', name: 'Tiruvarur' },
  { id: 'vellore', name: 'Vellore' },
  { id: 'viluppuram', name: 'Viluppuram' },
  { id: 'virudhunagar', name: 'Virudhunagar' },
];

interface DistrictSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export const DistrictSelect: React.FC<DistrictSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select your district"
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-card shadow-md hover:shadow-lg transition-smooth border-primary/20 focus:border-primary">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 bg-card border-primary/20 shadow-xl">
        {tamilNaduDistricts.map((district) => (
          <SelectItem 
            key={district.id} 
            value={district.id}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
          >
            {district.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};