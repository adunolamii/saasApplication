import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <div>
        <Link href="/">
        <div className='items-center hidden lg:flex '>
            <Image src="logo.svg" alt='logo' height={28} width={ 28}/>
            <p className=' font-semibold text-white text-2xl  ml-2.5'>Finance</p>
        </div>
        </Link>
    </div>
  )
}

export default Logo


//       {/* <div className=" hidden lg:flex items-center gap-2 overflow-x-auto">
//         {routes.map((route) => (
//           <div key={route.id} className="flex items-center gap-2">
//             <Link href={route.href}>
//               <p
//                 className={` hover:text-purple-600 hover:bg-black flex gap-2 text-gray-200 font-medium p-5 cursor-pointer rounded-lg ${
//                   href == route.href && "text-blue-600"
//                 }`}
//               >
//                 {route.label}
//               </p>
//             </Link>
//           </div>
//         ))}
//       </div> */}






// // const Navigation = ({ routes, label }) => {
//   // const [isOpen, setIsOpen] = useState(false);
//   // const router = useRouter();
//   // const isMobile = useMedia("(max-width: 1024px)", false);
//   // // const onClick = (href: string)=>{
//   //     router.push(href);
//   //     setIsOpen(false)
//   // };
// //   return (
// //     <Sheet open={isOpen} onOpenChange={setIsOpen}>
// //       <SheetTrigger>
// //         <Button
// //           variant="outline"
// //           size="sm"
// //           className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition "
// //         >
// //           <Menu className=" h-4 w-4" />
// //         </Button>
// //       </SheetTrigger>
// //       <SheetContent side="left" className="px-2">
// //         <nav className="flex flex-col gap-y-2 pt-6">
// //           {routes.map(route => {
// //             <Button
// //               key={route.href}
// //               variant={route.href === label ? "secondary" : "ghost"}
// //               onClick={() => onClick(route.href)}
// //             >
// //               {routes.label}
// //             </Button>;
// //           })}
  

// //         </nav>
// //       </SheetContent>
// //       <SheetContent side="left" className="px-2">
     
// // </SheetContent>

// //     </Sheet>
// //   );


 // const href = usePathname();
  // useEffect(() => {
  //   console.log(href);
  // }, [href]);