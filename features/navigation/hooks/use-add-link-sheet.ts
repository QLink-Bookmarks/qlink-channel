import * as React from "react";

function useAddLinkSheet() {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    open,
    close,
    handleOpenChange,
  };
}

export { useAddLinkSheet };
