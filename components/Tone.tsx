import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type ToneProps = {
  settone: (value: string)=>void,
  tone: string
}

export function Tone({settone, tone}: ToneProps) {
  
  const handleChange = (value: string) => {
    settone(value);
  };

  return (
    <Select onValueChange={handleChange} value={tone}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a tone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tone</SelectLabel>
          <SelectItem value="casual">casual</SelectItem>
          <SelectItem value="funny">funny</SelectItem>
          <SelectItem value="sarcasm">sarcasm</SelectItem>
          <SelectItem value="techy">techy</SelectItem>
          <SelectItem value="formal">formal</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
