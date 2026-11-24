import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ className, ...props }) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${className} pr-12`} />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-controls={props.id}
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-zinc-400 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-400"
      >
        <Icon size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
