import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabSwitcherProps {
  signUpTab: React.ReactNode;
  signInTab: React.ReactNode;
}

export function TabSwitcher({ signUpTab, signInTab }: TabSwitcherProps) {
  return (
    <Tabs defaultValue="signIn" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        <TabsTrigger value="signIn">Sign In</TabsTrigger>
      </TabsList>
      <TabsContent value="signUp">{signUpTab}</TabsContent>
      <TabsContent value="signIn">{signInTab}</TabsContent>
    </Tabs>
  );
}
