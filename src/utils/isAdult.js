export function isAdult(birthdate) {
    // Parse the birthdate string to a Date object
    const birthdateDate = new Date(birthdate);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the age
    let age = currentDate.getFullYear() - birthdateDate.getFullYear();
  
    // Check if the birthday has occurred this year
    const hasBirthdayOccurred = (
      currentDate.getMonth() > birthdateDate.getMonth() ||
      (currentDate.getMonth() === birthdateDate.getMonth() && currentDate.getDate() >= birthdateDate.getDate())
    );
  
    // If the birthday has not occurred, decrement the age
    if (!hasBirthdayOccurred) {
      age--;
    }
  
    // Check if the age is 18 or older
    return age >= 18;
  }

  