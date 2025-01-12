import React from "react";

const ResponseMessage = ({ message, isAttending }) => {
  return (
    <div className="mt-6 p-6 rounded-lg text-center shadow-lg">
      <p className="text-2xl font-semibold text-white">{message}</p>
      <p className="text-xl mt-2 text-white">
        {isAttending ? (
          <>😊 We are excited to see you! 🎉</>
        ) : (
          <>
            😞 We’re sad to hear that, but we’d be happy to have you if you can
            make it. 🤗
          </>
        )}
      </p>
    </div>
  );
};

export default ResponseMessage;
