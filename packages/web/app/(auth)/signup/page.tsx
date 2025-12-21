import { Suspense } from "react"
import { MockRegistA, MockRegistB, MockRegistC } from "./mock"
import { SignUpScreen } from "./SignUpScreen"

export default function Page() {
  return (
    <>
    <Suspense fallback={null}>
      <SignUpScreen />
      {/* <MockRegistA />
      <MockRegistB />
      <MockRegistC /> */}
    </Suspense>
    </>
)
}
