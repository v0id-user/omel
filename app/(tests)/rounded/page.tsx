export default function Rounded() {
  return (
    <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
      <h1>Testing rounded corners</h1>

      <div className="rounded-md bg-red-500 w-10 h-10"></div>
      <div className="smooth-corners-md bg-red-500 w-10 h-10"></div>
    </div>
  );
}
