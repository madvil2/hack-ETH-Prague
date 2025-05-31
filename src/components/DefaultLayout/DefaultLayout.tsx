import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { ReactNode } from "react";
import { Container, Flex } from "@radix-ui/themes";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Container size="4" p="4">
      <Flex direction="column" gap="4">
        <Flex justify="end">
          <LanguageSwitcher />
        </Flex>
        {children}
      </Flex>
    </Container>
  );
};

export default DefaultLayout;
