const maxCount = 1000;
const counterSelector = '.rtExYb';
const checkboxSelector = '.ckGgle';
const photoDivSelector = ".yDSiEe.uGCjIb.zcLWac.eejsDc.TWmIyd";
const deleteButtonSelector = 'button[aria-label="Delete"]';
const confirmationButtonSelector = '#yDmH0d > div.llhEMd.iWO5td > div > div.g3VIld.V639qd.bvQPzd.oEOLpc.Up8vH.J9Nfi.A9Uzve.iWO5td > div.XfpsVe.J9fJmf > button.VfPpkd-LgbsSe.VfPpkd-LgbsSe-OWXEXe-k8QpJ.nCP5yc.kHssdc.HvOprf';

async function deleteGooglePhotos() {
    // Retrieves the current count of selected photos
    const getCount = () => {
        const counterElement = document.querySelector(counterSelector);
        return counterElement ? parseInt(counterElement.textContent) || 0 : 0;
    };

    // Waits for a specified time
    const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

    // Scrolls the photo list down
    const scrollPhotoList = () => {
        document.querySelector(photoDivSelector).scrollBy(0, window.outerHeight);
    };

    // Scrolls the photo list to the top
    const scrollPhotoListToTop = () => {
        document.querySelector(photoDivSelector).scrollTop = 0;
    };

    // Waits until a specific condition is met, then returns the result
    const waitUntil = async (resultFunction, conditionFunction = x => x, timeout = 60000) => {
        let startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            let result = await resultFunction();
            if (conditionFunction(result)) return result;
            await wait(100);
        }
        throw new Error("Timeout reached");
    };

    // Handles the deletion of selected photos
    const deleteSelected = async () => {
        let count = getCount();
        if (count <= 0) return;
        console.log("Deleting " + count);

        const deleteButton = document.querySelector(deleteButtonSelector);
        deleteButton.click();

        const confirmation_button = await waitUntil(() => document.querySelector(confirmationButtonSelector));
        confirmation_button.click();

        await waitUntil(() => getCount() === 0);
        scrollPhotoListToTop();
    };

    // Main loop to select and delete photos
    while (true) {
        try {
            const checkboxes = await waitUntil(
                () => [...document.querySelectorAll(checkboxSelector)].filter(x => x.ariaChecked == 'false'), 
                x => x.length > 0
            );
            let count = getCount();
            checkboxes.slice(0, maxCount - count).forEach(x => x.click());
            await wait(200);
            count = getCount();
            console.log("Selected " + count);

            if (count >= maxCount) {
                await deleteSelected();
            } else {
                scrollPhotoList();
            }
        } catch (e) {
            console.log(e);
            break; // Break out of the loop if a timeout occurs
        }
    }

    // Final deletion for any remaining photos
    await deleteSelected();

    console.log('End of deletion process');
}

await deleteGooglePhotos();
