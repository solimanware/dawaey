const fs = require("fs");
const path = require("path");

async function updateDrugPrices() {
  try {
    console.log("🚀 Starting drug price update process...");

    // Define file paths
    const drugsPath = path.join(__dirname, "../assets/data/drugs.json");
    const newDrugsPath = path.join(__dirname, "../assets/data/new_drugs.json");
    const backupPath = path.join(__dirname, "../assets/data/drugs_backup.json");

    // Read both JSON files
    console.log("📖 Reading drugs.json...");
    const drugsData = JSON.parse(fs.readFileSync(drugsPath, "utf8"));

    console.log("📖 Reading new_drugs.json...");
    const newDrugsData = JSON.parse(fs.readFileSync(newDrugsPath, "utf8"));

    console.log(`📊 Found ${drugsData.length} drugs in main file`);
    console.log(`📊 Found ${newDrugsData.length} drugs in new file`);

    // Create backup of original file
    console.log("💾 Creating backup of original drugs.json...");
    fs.writeFileSync(backupPath, JSON.stringify(drugsData, null, 2));

    // Create lookup map from new drugs by tradename (case-insensitive)
    const newDrugsMap = new Map();
    newDrugsData.forEach((drug) => {
      if (
        drug.tradename &&
        drug.price !== undefined &&
        drug.price !== null &&
        drug.price !== ""
      ) {
        const tradename = drug.tradename.toLowerCase().trim();
        newDrugsMap.set(tradename, drug);
      }
    });

    console.log(
      `🔍 Created lookup map with ${newDrugsMap.size} drugs with valid prices`
    );

    // Track updates
    let updatedCount = 0;
    let matchedCount = 0;
    const updates = [];

    // Update prices in main drugs array
    drugsData.forEach((drug, index) => {
      if (!drug.tradename) return;

      const tradename = drug.tradename.toLowerCase().trim();
      const newDrug = newDrugsMap.get(tradename);

      if (newDrug) {
        matchedCount++;

        // Parse prices as numbers
        const currentPrice = parseFloat(drug.price) || 0;
        const newPrice = parseFloat(newDrug.price) || 0;

        // Update if new price is higher
        if (newPrice > currentPrice) {
          const oldPrice = drug.price;
          drug.price = newDrug.price;
          updatedCount++;

          updates.push({
            tradename: drug.tradename,
            oldPrice: oldPrice,
            newPrice: newDrug.price,
            increase: (newPrice - currentPrice).toFixed(2),
          });

          console.log(
            `💰 Updated ${drug.tradename}: ${oldPrice} → ${newDrug.price} EGP (+${(newPrice - currentPrice).toFixed(2)})`
          );
        }
      }
    });

    // Write updated data back to file
    if (updatedCount > 0) {
      console.log(`✍️  Writing updated data to drugs.json...`);
      fs.writeFileSync(drugsPath, JSON.stringify(drugsData, null, 2));

      // Generate update report
      const reportPath = path.join(
        __dirname,
        "../assets/data/price_update_report.json"
      );
      const report = {
        timestamp: new Date().toISOString(),
        totalDrugs: drugsData.length,
        matchedDrugs: matchedCount,
        updatedDrugs: updatedCount,
        updates: updates.sort(
          (a, b) => parseFloat(b.increase) - parseFloat(a.increase)
        ),
      };

      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`📋 Generated update report: ${reportPath}`);
    }

    // Summary
    console.log("\n📈 Update Summary:");
    console.log(`   Total drugs in database: ${drugsData.length}`);
    console.log(`   Drugs found in new data: ${matchedCount}`);
    console.log(`   Prices updated: ${updatedCount}`);
    console.log(
      `   Match rate: ${((matchedCount / drugsData.length) * 100).toFixed(1)}%`
    );
    console.log(
      `   Update rate: ${((updatedCount / matchedCount) * 100).toFixed(1)}% of matched drugs`
    );

    if (updatedCount > 0) {
      console.log("\n✅ Price update completed successfully!");
      console.log(`📁 Backup saved to: ${backupPath}`);
    } else {
      console.log("\n✨ No price updates needed - all prices are current!");
    }
  } catch (error) {
    console.error("❌ Error updating drug prices:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the update
updateDrugPrices();
