// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Tewo
 * @dev A contract to manage farm produce listings, purchase requests, and payments.
 */
contract Tewo {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint public produceCount;
    uint public requestCount;

    mapping(uint => Produce) public allProduce;
    mapping(uint => PurchaseRequest) private allRequests;
    mapping(bytes32 => mapping(address => bool)) private _roles;

    struct Produce {
        uint256 produceId;
        address farmer;
        string name;
        string description;
        uint256 price;
        uint256 quantity;
        string[] imageUrl;
        bool available;
        string company;
        string location;
    }

    struct ProduceInput {
        string name;
        string description;
        uint256 price;
        uint256 quantity;
        string[] imageUrl;
        string company;
        string location;
    }

    struct PurchaseRequest {
        uint256 requestId;
        uint256 produceId;
        address buyer;
        uint256 quantity;
        bool delivered;
        bool paid;
    }

    // Custom Errors
    error InvalidAmount();
    error InsufficientFunds();
    error UnauthorizedAccess();
    error RoleAlreadyGranted();
    error RoleNotFound();

    // Events
    event ProduceListed(address indexed farmer, uint256 indexed produceId, string name, uint256 price);
    event PurchaseRequested(address indexed buyer, uint256 indexed produceId, uint256 quantity);
    event ProduceDelivered(uint256 indexed requestId, address indexed farmer, address indexed buyer);
    event PaymentMade(uint256 indexed requestId, address indexed farmer, uint256 amount);

    modifier onlyRole(bytes32 role) {
        require(hasRole(role, msg.sender), "Not authorized");
        _;
    }

    constructor(address admin) {
        _grantRole(ADMIN_ROLE, admin);
    }

    function registerFarmer() external {
        require(!hasRole(FARMER_ROLE, msg.sender), "Already a farmer");
        _grantRole(FARMER_ROLE, msg.sender);
    }

    function listProduce(
        ProduceInput calldata input
    ) external onlyRole(FARMER_ROLE) {
        if (input.price == 0 || input.quantity == 0) {
            revert InvalidAmount();
        }
        produceCount++;
        _createProduce(produceCount, msg.sender, input);
        emit ProduceListed(msg.sender, produceCount, input.name, input.price);
    }

    function _createProduce(
        uint256 produceId,
        address farmer,
        ProduceInput calldata input
    ) internal {
        allProduce[produceId] = Produce({
            produceId: produceId,
            farmer: farmer,
            name: input.name,
            description: input.description,
            price: input.price,
            quantity: input.quantity,
            imageUrl: input.imageUrl,
            available: true,
            company: input.company,
            location: input.location
        });
    }

    function requestPurchase(
        uint256 _produceId,
        uint256 _quantity
    ) external payable {
        Produce storage produce = allProduce[_produceId];
        _validatePurchase(produce, _quantity, msg.value);

        requestCount++;
        _createPurchaseRequest(requestCount, _produceId, msg.sender, _quantity);

        _updateProduceQuantity(produce, _quantity);

        emit PurchaseRequested(msg.sender, _produceId, _quantity);
    }

    function _validatePurchase(
        Produce storage produce,
        uint256 quantity,
        uint256 value
    ) internal view {
        require(produce.available, "Produce not available");
        require(produce.quantity >= quantity, "Not enough quantity available");
        require(value == produce.price * quantity, "Incorrect Ether amount");
    }

    function _createPurchaseRequest(
        uint256 requestId,
        uint256 produceId,
        address buyer,
        uint256 quantity
    ) internal {
        allRequests[requestId] = PurchaseRequest(
            requestId,
            produceId,
            buyer,
            quantity,
            false,
            false
        );
    }

    function _updateProduceQuantity(
        Produce storage produce,
        uint256 quantity
    ) internal {
        produce.quantity -= quantity;
        if (produce.quantity == 0) {
            produce.available = false;
        }
    }

    function confirmDelivery(
        uint256 _requestId
    ) external onlyRole(FARMER_ROLE) {
        PurchaseRequest storage request = allRequests[_requestId];
        require(!request.delivered, "Already delivered");

        request.delivered = true;

        emit ProduceDelivered(_requestId, msg.sender, request.buyer);
    }

    function payFarmer(uint256 _requestId) external {
        PurchaseRequest storage request = allRequests[_requestId];
        require(request.delivered, "Delivery not confirmed");
        require(!request.paid, "Already paid");

        request.paid = true;
        Produce storage produce = allProduce[request.produceId];
        payable(produce.farmer).transfer(request.quantity * produce.price);

        emit PaymentMade(
            _requestId,
            produce.farmer,
            request.quantity * produce.price
        );
    }

    function grantRole(
        bytes32 role,
        address account
    ) external onlyRole(ADMIN_ROLE) {
        _grantRole(role, account);
    }

    function revokeRole(
        bytes32 role,
        address account
    ) external onlyRole(ADMIN_ROLE) {
        _revokeRole(role, account);
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    function _grantRole(bytes32 role, address account) internal {
        if (_roles[role][account]) {
            revert RoleAlreadyGranted();
        }
        _roles[role][account] = true;
    }

    function _revokeRole(bytes32 role, address account) internal {
        if (!_roles[role][account]) {
            revert RoleNotFound();
        }
        _roles[role][account] = false;
    }

    function withdraw() public onlyRole(ADMIN_ROLE) {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }

    receive() external payable {}

    fallback() external payable {
    }

      /**
     * @dev Fetch all produce listings.
     * @return A list of all Produce structs.
     */
    function getAllProduce() external view returns (Produce[] memory) {
        Produce[] memory produces = new Produce[](produceCount);
        for (uint i = 1; i <= produceCount; i++) {
            produces[i - 1] = allProduce[i];
        }
        return produces;
    }

    /**
     * @dev Fetch a specific produce by its ID.
     * @param _produceId The ID of the produce to fetch.
     * @return The Produce struct for the given produceId.
     */
    function getProduceById(uint256 _produceId) external view returns (Produce memory) {
        return allProduce[_produceId];
    }

}
