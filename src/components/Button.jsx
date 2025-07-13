import clsx from "clsx";

const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full px-5 py-2 text-black",
        containerClass
      )}
    >
      {leftIcon}
      <span className="relative inline-flex overflow-hidden font-general text-[10px] uppercase items-center">
        {/* Atas */}
        <span className="inline-flex items-center gap-1 translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[160%] group-hover:skew-y-12">
          <b>{title}</b>
        </span>

        {/* Bawah */}
        <span className="absolute inline-flex items-center gap-1 translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          <b>{title}</b>    
        </span>
      </span>
      {rightIcon}
    </button>
  );
};

export default Button;
